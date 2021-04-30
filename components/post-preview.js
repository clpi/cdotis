import CoverImage from './cover-image'
import dateFormat from 'dateformat'
import Link from 'next/link'

export default function PostPreview({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}) {
  const fmtDate = (dateIn) => {
    const dateObj = Date.parse(dateIn);
    dateFormat(dateObj, "dddd, mmmm dS, yyyy, h:MM:ss TT")
  }
  return (
    <div>
      <div className="mb-5">
        <CoverImage
          title={title}
          src={coverImage}
          slug={slug}
          height={278}
          width={556}
        />
      </div>
      <h3 className="mb-3 text-3xl font-light leading-snug">
        <Link as={`/posts/${slug}`} href="/posts/[slug]">
          <a className="hover:underline" class="font-light">{title}</a>
        </Link>
      </h3>
      <p> {
        fmtDate(date)
      } </p>
      <hr/>
      <div className="mb-4 text-lg">
      </div>
      <p className="mb-4 leading-relaxed" class="font-light text-gray-800">{excerpt}</p>
    </div>
  )
}
