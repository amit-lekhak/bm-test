import { Link } from '@remix-run/react';

export default function Meeting({
  title,
  time,
  type,
  slug,
}: {
  title: string;
  time: string;
  type: string;
  slug: string;
}) {
  return (
    <Link
      className='w-full p-5 block group/icon relative hover:bg-gray-50 border-b border-neutral-200 first:rounded-t-md last:rounded-b-md last:border-b-0'
      to={slug}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 448 512'
        className='h-4 w-4 absolute top-4 right-4 opacity-0 group-hover/icon:opacity-100 transition-opacity'
      >
        {/* <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --> */}
        <path d='M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z' />
      </svg>
      <div className='flex flex-wrap items-center'>
        <h2 className='text-sm font-semibold text-gray-700'>{title}</h2>
      </div>

      <div className='text-neutral-500'>
        <ul className='mt-2 flex flex-wrap space-x-2'>
          <li>
            <div className='rounded-md bg-gray-100 flex items-center justify-center py-0.5 px-2 text-xs font-normal'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 512 512'
                className='h-3 w-3 mr-1'
              >
                {/* <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --> */}
                <path d='M232 120C232 106.7 242.7 96 256 96C269.3 96 280 106.7 280 120V243.2L365.3 300C376.3 307.4 379.3 322.3 371.1 333.3C364.6 344.3 349.7 347.3 338.7 339.1L242.7 275.1C236 271.5 232 264 232 255.1L232 120zM256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0zM48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48C141.1 48 48 141.1 48 256z' />
              </svg>
              {time}
            </div>
          </li>

          <li>
            <div className='rounded-md bg-gray-100 flex items-center justify-center py-0.5 px-2 text-xs font-normal'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 448 512'
                className='h-3 w-3 mr-1'
              >
                {/* <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --> */}
                <path d='M272 304h-96C78.8 304 0 382.8 0 480c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32C448 382.8 369.2 304 272 304zM48.99 464C56.89 400.9 110.8 352 176 352h96c65.16 0 119.1 48.95 127 112H48.99zM224 256c70.69 0 128-57.31 128-128c0-70.69-57.31-128-128-128S96 57.31 96 128C96 198.7 153.3 256 224 256zM224 48c44.11 0 80 35.89 80 80c0 44.11-35.89 80-80 80S144 172.1 144 128C144 83.89 179.9 48 224 48z' />
              </svg>
              {type}
            </div>
          </li>
        </ul>
      </div>
    </Link>
  );
}
