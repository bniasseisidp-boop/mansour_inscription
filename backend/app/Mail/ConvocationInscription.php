<?php

namespace App\Mail;

use App\Models\Student;
use App\Services\EtablissementService;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ConvocationInscription extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Student $student,
    ) {}

    public function envelope(): Envelope
    {
        $identite = EtablissementService::identite();

        return new Envelope(
            subject: "📅 Convocation — Finalisez votre inscription à {$identite['nom']}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.convocation',
            with: ['identite' => EtablissementService::identite()],
        );
    }
}
