<?php
$user = App\Models\User::firstOrCreate(
    ['email' => 'superadmin@admin.com'],
    [
        'name' => 'Superadmin',
        'password' => bcrypt('password')
    ]
);
$user->assignRole('Super Admin');
echo "Superadmin created successfully with email: superadmin@admin.com and password: password";
