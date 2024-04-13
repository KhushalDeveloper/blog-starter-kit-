import Container from '@/app/_components/container'
import { PostHeader } from '@/app/_components/post-header'
import { getAllPosts, getPostBySlug } from '@/lib/api'
import { CMS_NAME } from '@/lib/constants'
import markdownToHtml from '@/lib/markdownToHtml'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export default async function Post({ params }: Params) {
  const post = getPostBySlug(params.slug)

  if (!post) return notFound()

  const content = await markdownToHtml(post.content || '')
  return (
    <main>
      <Container>
        <article className='my-3'>
          <PostHeader
            title={post.title}
            coverImage={post.coverImage}
            author={post.author}
            date={post.date}
          />
        </article>
      </Container>
    </main>
  )
}

type Params = {
  params: {
    slug: string
  }
}

export function generateMetadata({ params }: Params): Metadata {
  const post = getPostBySlug(params.slug)

  if (!post) {
    return notFound()
  }

  const title = `${post.title} | Next.js Blog Example with ${CMS_NAME}`

  return {
    title,
    openGraph: {
      title,
      images: [post.ogImage.url],
    },
  }
}

export async function generateStaticParams() {
  const posts = getAllPosts()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}