<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeSalaryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Map database status to frontend status
        $statusMapping = [
            'pending' => 'pending',
            'paid' => 'approved',
            'unpaid' => 'rejected'
        ];

        $frontendStatus = $statusMapping[$this->status] ?? $this->status;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'employeeId' => $this->employee_id,
            'salary' => (float) $this->salary,
            'monthYear' => $this->month_year,
            'status' => $frontendStatus,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}