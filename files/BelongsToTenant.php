<?php

namespace App\Tenancy;

use Illuminate\Database\Eloquent\Builder;

trait BelongsToTenant {

    public static function bootBelongsToTenant() 
    {
        if (auth()->check()) {
            
            static::creating(function ($model) {
                $model->user_id = auth()->id();
            });

            static::addGlobalScope('user_id', function (Builder $builder) {
                return $builder->where('user_id', auth()->id());
            });

        }
    }

}