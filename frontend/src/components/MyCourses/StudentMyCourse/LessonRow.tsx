import React from 'react'
import { IconVideo, IconReading, IconQuiz, IconAssignment } from '../../../assets/icons/course_icons';
import YouTubeEmbed from './YoutubeEmbed';



const lessonTypeConfig = {
  video: { icon: <IconVideo />, label: "Video", color: "text-sky-400", bg: "bg-sky-400/10" },
  reading: { icon: <IconReading />, label: "Reading", color: "text-amber-400", bg: "bg-amber-400/10" },
  quiz: { icon: <IconQuiz />, label: "Quiz", color: "text-violet-400", bg: "bg-violet-400/10" },
  assignment: { icon: <IconAssignment />, label: "Assignment", color: "text-rose-400", bg: "bg-rose-400/10" },
};

const LessonRow = ({ section, index, course_id }: { section: any; index: number; course_id: string }) => {

  return (
    <>
      <div className='mx-5 mb-7'>
        <div className='flex gap-2'>
          <div className='text-sm text-white/40'>#{index + 1}</div>
          <div className='font-semibold text-white/90 truncate'>{section.section_title}</div>
        </div>
        <div className='mt-2 mx-2'>
          <div className='mb-3'>
            {section.section_content}
          </div>
          {
            section.section_images &&
            <div className=''>
              <div className='mb-3'>
                <img
                  src={section.section_images}
                  alt={section.section_title}
                  width={500}
                />
                <div className=''>
                  {section.image_description}
                </div>
              </div>
              <div>
                <YouTubeEmbed videoId={section.content_url} title={section.url_descriptio} />
              </div>

            </div>
          }
        </div>
      </div>
    </>
  );
};


export default LessonRow
