<?php

namespace App\Models;

use App\Enums\ApplicationStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

#[Fillable([
    'formation_id', 'last_name', 'first_name', 'email', 'phone', 'city', 'education_level',
    'diploma_obtained', 'message', 'consent_given_at', 'submission_token',
])]
class Application extends Model
{
    use SoftDeletes;

    protected static function booted(): void
    {
        static::creating(function (self $application): void {
            $application->uuid ??= (string) Str::uuid();
        });
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => ApplicationStatus::class,
            'consent_given_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Formation, $this>
     */
    public function formation(): BelongsTo
    {
        return $this->belongsTo(Formation::class)->withTrashed();
    }

    /**
     * @return HasMany<ApplicationDocument, $this>
     */
    public function documents(): HasMany
    {
        return $this->hasMany(ApplicationDocument::class);
    }

    /**
     * @return HasMany<ApplicationNote, $this>
     */
    public function notes(): HasMany
    {
        return $this->hasMany(ApplicationNote::class)->latest();
    }

    /**
     * @return HasMany<ApplicationStatusHistory, $this>
     */
    public function statusHistory(): HasMany
    {
        return $this->hasMany(ApplicationStatusHistory::class)->latest('created_at');
    }
}
