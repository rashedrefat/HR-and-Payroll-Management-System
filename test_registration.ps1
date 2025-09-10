$headers = @{"Content-Type" = "application/json"}
$body = @{
    firstName = "John"
    lastName = "Doe"  
    email = "john.doe.test2@example.com"
    phone = "1234567890"
    password = "password123"
    password_confirmation = "password123"
    role = "employee"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/api/register" -Method POST -Headers $headers -Body $body
    Write-Host "Success! Registration completed."
    Write-Host "User ID: $($response.user.id)"
    Write-Host "User Role ID: $($response.user.role_id)"
    Write-Host "User Email: $($response.user.email)"
    Write-Host "Response: $($response | ConvertTo-Json -Depth 3)"
}
catch {
    Write-Host "Error during registration:"
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        $errorStream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorStream)
        $errorContent = $reader.ReadToEnd()
        Write-Host "Error Response: $errorContent"
    }
}
