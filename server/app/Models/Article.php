<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'content',
        'version',
        'original_url',
        'parent_article_id'
    ];

    public function parent()
    {
        return $this->belongsTo(Article::class, 'parent_article_id');
    }
}
