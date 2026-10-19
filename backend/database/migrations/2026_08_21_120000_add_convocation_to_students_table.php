<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->timestamp('date_convocation')->nullable()->after('statut_inscription');
            $table->string('lieu_convocation')->nullable()->after('date_convocation');
            $table->text('message_convocation')->nullable()->after('lieu_convocation');
            $table->foreignId('convoque_par')->nullable()->after('message_convocation')
                ->constrained('users')->onDelete('set null');
        });

        if (DB::connection()->getDriverName() === 'sqlite') {
            DB::statement('PRAGMA writable_schema = ON');
            DB::statement("
                UPDATE sqlite_master
                SET sql = REPLACE(
                    sql,
                    'check (\"statut_inscription\" in (''en_attente'', ''en_attente_paiement'', ''accepte'', ''rejete''))',
                    'check (\"statut_inscription\" in (''en_attente'', ''convoque'', ''en_attente_paiement'', ''accepte'', ''rejete''))'
                )
                WHERE type = 'table' AND name = 'students'
            ");
            DB::statement('PRAGMA writable_schema = OFF');
            DB::statement('PRAGMA integrity_check');
            return;
        }

        DB::statement("ALTER TABLE students MODIFY statut_inscription ENUM('en_attente', 'convoque', 'en_attente_paiement', 'accepte', 'rejete') NOT NULL DEFAULT 'en_attente'");
    }

    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropConstrainedForeignId('convoque_par');
            $table->dropColumn(['date_convocation', 'lieu_convocation', 'message_convocation']);
        });

        if (DB::connection()->getDriverName() === 'sqlite') {
            DB::statement('PRAGMA writable_schema = ON');
            DB::statement("
                UPDATE sqlite_master
                SET sql = REPLACE(
                    sql,
                    'check (\"statut_inscription\" in (''en_attente'', ''convoque'', ''en_attente_paiement'', ''accepte'', ''rejete''))',
                    'check (\"statut_inscription\" in (''en_attente'', ''en_attente_paiement'', ''accepte'', ''rejete''))'
                )
                WHERE type = 'table' AND name = 'students'
            ");
            DB::statement('PRAGMA writable_schema = OFF');
            return;
        }

        DB::statement("ALTER TABLE students MODIFY statut_inscription ENUM('en_attente', 'en_attente_paiement', 'accepte', 'rejete') NOT NULL DEFAULT 'en_attente'");
    }
};
