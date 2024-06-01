import { useState, useEffect } from 'react';
import axios from 'axios';

function useRoom(user) {
  const onGetTopics = async () => {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_SERVER_URL + '/api/v1/topics',
      {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      }
    );
    return response.data;
  };
  return {
    onGetTopics,
  };
}

export default useRoom;
