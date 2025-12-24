<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ArticleController extends Controller
{
    public function index()
    {
        return Article::latest()->paginate(10);
    }

    public function show(Article $article)
    {
        return $article;
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required',
            'content' => 'required',
            'version' => 'required|in:original,rewritten',
            'original_url' => 'nullable|url',
            'parent_article_id' => 'nullable|exists:articles,id',
        ]);

        $data['slug'] = Str::slug($data['title']) . '-' . uniqid();

        return Article::create($data);
    }

    public function update(Request $request, Article $article)
    {
        $article->update($request->only('title', 'content'));
        return $article;
    }

    public function destroy(Article $article)
    {
        $article->delete();
        return response()->noContent();
    }
}
