import CoverImage from '../components/cover-image'

export default function PostHeader(props) {
  return (
    <>
    <h1 className="mb-12 text-4xl leading-tight tracking-tighter text-center font-extralight md:text-5xl lg:text-6xl md:leading-none md:text-left">
      {props.children}
    </h1>
      <div className="hidden md:block md:mb-12">
        <div className="flex items-center">
          <img src="/assets/face.jpg" className="w-12 h-12 mr-4 rounded-full" alt={props.author.name} />
          <span className="text-xl font-medium text-gray-800">{props.author.name}</span>
        </div>
      </div>
      <div className="mb-2 md:mb-4 sm:mx-0">
        <CoverImage title={props.title} src={props.coverImage} height={620} width={1240} />
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="block mb-6 md:hidden">
        <div className="flex items-center">
          <img src="/assets/face.jpg" className="w-12 h-12 mr-4 rounded-full" alt={props.author.name} />
          <span className="font-light text-gray-800 text-md">{props.author.name}</span> <span class="text-gray-500"> { props.date }</span>
        </div>
        </div>
      </div>
    </>
  )
}
