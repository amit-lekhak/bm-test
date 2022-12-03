import Meeting from '~/components/Meeting';

export default function Index() {
  const data = [
    {
      id: 1,
      title: '30 Min Meeting',
      time: '30 m',
      type: '1-on-1',
      slug: '30min',
    },
    {
      id: 2,
      title: '15 Min Meeting',
      time: '15 m',
      type: '1-on-1',
      slug: '15min',
    },
  ];
  return (
    <div className='max-w-3xl px-4 py-24 mx-auto'>
      <div className='text-center mb-8'>
        <h1 className='mb-1 text-neutral-900 font-bold text-3xl'>
          Saroj Subedi
        </h1>
        <p className='text-neutral-500 text-sm'>test</p>
      </div>

      <div className='border border-neutral-200 bg-white rounded-md'>
        {data.map(({ id, ...props }) => (
          <Meeting key={id} {...props} />
        ))}
      </div>
    </div>
  );
}
