<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->string('bank_account_holder')->nullable()->after('currency');
            $table->string('bank_name')->nullable()->after('bank_account_holder');
            $table->string('bank_iban')->nullable()->after('bank_name');
            $table->string('bank_bic')->nullable()->after('bank_iban');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropColumn(['bank_account_holder', 'bank_name', 'bank_iban', 'bank_bic']);
        });
    }
};
