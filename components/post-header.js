import CoverImage from '../components/cover-image'
import PostTitle from '../components/post-title'

export default function PostHeader({ title, coverImage, date, author }) {
  return (
    <>
      <PostTitle>{title}</PostTitle>
      <div className="hidden md:block md:mb-12">
        <div className="flex items-center">
          <img src="/assets/face.jpg" className="w-12 h-12 mr-4 rounded-full" alt={author.name} />
          <span className="text-xl font-medium text-gray-800">{author.name}</span>
        </div>
      </div>
      <div className="mb-8 md:mb-16 sm:mx-0">
        <CoverImage title={title} src={coverImage} height={620} width={1240} />
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="block mb-6 md:hidden">
        <div className="flex items-center">
          <img src="/assets/face.jpg" className="w-12 h-12 mr-4 rounded-full" alt={author.name} />
          <span className="text-xl font-medium text-gray-800">{author.name}</span> <span class="text-gray-500"> { date }</span>
        </div>
        </div>
      </div>
    </>
  )
}
