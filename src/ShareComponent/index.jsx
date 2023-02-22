import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {getShare} from "../API/audiosApi";

function ShareComponent({user_id, setFetchAudios}) {
  const navigate = useNavigate();

  const { share_id } = useParams();
  const shareUnmountRef = useRef(false);

  useEffect(() => {
    async function fetchShare() {
      if (share_id && shareUnmountRef.current == false) {
        console.log("Executed")
        try {
          await getShare(share_id, user_id);
          setFetchAudios(prev => !prev);
          shareUnmountRef.current = true;
          navigate('/')
          
        } catch (err) {
          console.log(err);
        }
      }
    }
    fetchShare();
    shareUnmountRef.current = true;
  }, [shareUnmountRef]);
  
  return null;
}




export {ShareComponent};