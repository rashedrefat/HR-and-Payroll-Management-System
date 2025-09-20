# Employee Login Credentials

## Default Password: 123456

All employees can now login using their email address and the password: **123456**

## Employee Accounts:

### 1. Bandhan
- **Email:** bandhan@gmail.com
- **Password:** 123456
- **Role:** Employee
- **Dashboard:** /employee/dashboard

### 2. Auntu Rahman
- **Email:** auntu@gmail.com
- **Password:** 123456
- **Role:** Employee
- **Dashboard:** /employee/dashboard

### 3. Shahriar
- **Email:** shahriar@gmail.com
- **Password:** 123456
- **Role:** Employee
- **Dashboard:** /employee/dashboard

### 4. Rafiad
- **Email:** rafiad@gmail.com
- **Password:** 123456
- **Role:** Employee
- **Dashboard:** /employee/dashboard

## Login URLs:
- Employee Login: http://localhost:3000/employee/login
- Admin Login: http://localhost:3000/signin

## Features Available to Employees:
- View personal profile and information
- View profile picture
- Access employee dashboard
- View attendance records
- Access payroll information
- Submit leave requests

## Notes:
- All employee passwords have been standardized to "123456" for easy access
- Employees should change their passwords after first login for security
- Profile pictures are automatically loaded from the backend image directory
- Each employee sees their own personalized information when logged in

## Troubleshooting:
- If login fails, ensure the email is typed correctly
- Clear browser cache if experiencing issues
- Check that the backend server is running on the correct port
- Verify database connection is active

## Security Recommendations:
- Implement password change functionality for employees
- Add password complexity requirements
- Consider implementing password reset via email
- Add session timeout for security