<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$student = \App\Models\Student::find(18);
if ($student) {
    echo "User ID: " . $student->user_id . "\n";
    $user = $student->user;
    if ($user) {
        $roles = $user->roles;
        echo "Roles count: " . $roles->count() . "\n";
        foreach ($roles as $role) {
            echo "Role: " . $role->name . "\n";
        }
    } else {
        echo "No user attached.\n";
    }
}
