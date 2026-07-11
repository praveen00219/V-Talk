import React from 'react';
import styled from 'styled-components';
import useOnlineStatus from '../../hooks/useOnlineStatus';

const NetworkError = (props) => {
  const online = useOnlineStatus();

  if (online) return <>{props.children}</>;

  return (
    <Wrapper>
      <div className='container bg-black w-screen h-screen  p-10'>
        <div className='wrapper flex flex-col justify-center items-center w-full h-full p-5'>
          <div className="title text-center">
            <h1>Whoops!</h1>
          </div>
          <div className="description text-center mt-5">
            <p className=' text-lg text-center'>There seems to be a problem with your network connection</p>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default NetworkError;

const Wrapper = styled.div`
.container{
    background-color: ${({ theme }) => theme.colors.bg.primary};
}
.wrapper{
    background-color: ${({ theme }) => theme.colors.bg.secondary};
    box-shadow: 0 0 20px rgba(0,0,0,0.1)
}
.title.h1{
    color: ${({ theme }) => theme.colors.heading};
}
`;
