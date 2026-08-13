<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Comptes de démonstration — à usage de test uniquement.
        // Mot de passe pour les trois comptes : "password"
        User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'superadmin@demo.test',
            'role' => 'super_admin',
        ]);

        User::factory()->create([
            'name' => 'Admin Scolarité',
            'email' => 'admin@demo.test',
            'role' => 'admin',
        ]);

        User::factory()->create([
            'name' => 'Étudiant Démo',
            'email' => 'etudiant@demo.test',
            'role' => 'etudiant',
            'matricule' => 'ETU-0001',
        ]);
    }
}
