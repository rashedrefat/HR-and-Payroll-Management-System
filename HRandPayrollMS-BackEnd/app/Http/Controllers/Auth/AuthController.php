<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Http\Helpers\SystemLogger;
use App\Models\User\Tenant;
use App\Models\User\User;
use App\Services\Auth\RefreshTokenService;

class AuthController extends Controller
{
    public function refresh(Request $request, RefreshTokenService $refreshTokenService)
    {
        $request->validate([
            'refresh_token' => 'required|string',
        ]);

        $result = $refreshTokenService->validateAndRotate($request->refresh_token);

        if (!$result) {
            return response()->json(['message' => 'Invalid or expired refresh token.'], 401);
        }

        return response()->json([
            'access_token'  => $result['access_token'],
            'refresh_token' => $result['refresh_token'],
        ]);
    }
    public function register(Request $request, RefreshTokenService $refreshTokenService)
    {
        $request->validate([
            'firstName'        => 'required|string|max:255',
            'lastName'         => 'required|string|max:255',
            'email'            => 'required|email|unique:users,email',
            'phone'            => 'nullable|string',
            'password'         => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'firstName' => $request->firstName,
            'lastName'  => $request->lastName,
            'email'     => $request->email,
            'phone'     => $request->phone,
            'password'  => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;
        $refreshToken = $refreshTokenService->create($user); // ✅ create refresh token

        $tenant = new Tenant();
        $tenant->user_id = $user->id;
        $tenant->updated_by = $user->id;
        $tenant->save();

        $user->tenant_id = $tenant->id;
        $user->role_id = 2;
        $user->save();

        $user->assignRole('super_admin');


        SystemLogger::log('info', "New super admin registered: {$user->email}", $user->id);

        return response()->json([
            'message' => 'User registered successfully',
            'user'    => $user,
            'token'   => $token,
            'refresh_token'  => $refreshToken,  // ✅ include refresh token
        ], 201);
    }

    public function login(Request $request, RefreshTokenService $refreshTokenService)
    {
        $credentials = $request->only('email', 'password');

        $user = User::where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            return response()->json(['message' => 'Invalid login credentials'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;
        $refreshToken = $refreshTokenService->create($user); // ✅

        SystemLogger::log('info', "User logged in: {$user->email}", $user->id);

        return response()->json([
            'message'        => 'Login successful',
            'user'           => $user,
            'access_token'   => $token,
            'refresh_token'  => $refreshToken,
        ]);
    }


    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        SystemLogger::log('info', "User logged out: {$request->user()->email}");

        return response()->json([
            'message' => 'Successfully logged out',
        ], 200);
    }

    public function userRegister(Request $request, RefreshTokenService $refreshTokenService)
    {
        $validator = Validator::make($request->all(), [
            'firstName'        => 'required|string|max:255',
            'lastName'         => 'required|string|max:255',
            'email'            => 'required|email|unique:users,email',
            'phone'            => 'nullable|string',
            'password'         => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation Failed',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $user = User::create([
            'firstName' => $request->firstName,
            'lastName'  => $request->lastName,
            'email'     => $request->email,
            'phone'     => $request->phone,
            'password'  => Hash::make($request->password),
            'tenant_id' => tenant()->id,
        ]);

        $accessToken = $user->createToken('auth_token')->plainTextToken;
        $refreshToken = $refreshTokenService->create($user);

        SystemLogger::log('info', "New user registered under tenant ID " . tenant()->id . ": {$user->email}");

        return response()->json([
            'message'        => 'User registered successfully',
            'user'           => $user,
            'access_token'   => $accessToken,
            'refresh_token'  => $refreshToken,
        ], 201);
    }
}
