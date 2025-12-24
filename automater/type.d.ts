/**
 * Blog article
 */
interface Blog {
  id?: string;
  title: string;
  content: string | null;
  original_url: string;
  version: string;
  parent_article_id?: string;
}

interface RefArticle {
  title: string;
  content: string;
  link?: string;
}
