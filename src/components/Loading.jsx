import { useLoading, Bars } from '@agney/react-loading';

function Loading() {
  const { indicatorEl } = useLoading({
    loading: true,
    loaderProps: {
      style: {
        color: 'purple',
      },
      
    },
    indicator: <Bars width="80" />,
    
  });

  return (
    <div className='loading-page'>
        {indicatorEl}
        <p>Loading...</p>
    </div>
  );
}

export default Loading;