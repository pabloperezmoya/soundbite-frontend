import axios from "axios";
const url = "http://localhost:8000" // Backend URL

async function getAllAudios(user_id){
  return fetch(url + '/audio/all/' + user_id).then(resp => resp.json())

}

async function uploadAudio(user_id, file){
  
  return axios.post(url + '/audio/upload/' + user_id, file, {
    headers: {
      "Accept": "application/json",
      "Content-Type": "multipart/form-data"
    }
  }).then(resp => resp.status == 201? resp.data : console.log("Error on Upload audio, bad response", resp))
    .catch(err => console.log("Error on Upload audio", err))
}


async function deleteAudio(user_id, audio_id){
  
  return axios.delete(url + '/audio/delete/' + user_id + '/' + audio_id)
  .then(resp => resp.status == 200? resp.data : console.log("Error on Delete audio, bad response", resp))
  .catch(err => console.log("Error on Delete audio", err))
}

async function updateAudio(user_id, audio_id, name){
  return axios.put(url +  "/audio/update/" + user_id + "/" + audio_id + "/" + name)
  .then(resp => resp.status == 200? resp.data : console.log("Error on Updating audio, bad response", resp))
  .catch(err => console.log("Error on Updating audio", err))
}


async function createShare(audio_id, user_id){
  return axios.post(url + "/audio/share/create" , {
    audio_id: audio_id,
    user_id: user_id
  },
  {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    }
  }
  )
}

async function getShare(share_id, user_id){
  return axios.post(url + "/audio/share/" + share_id + "/" + user_id,
  {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    }
  })
}


export {getAllAudios, uploadAudio, deleteAudio, updateAudio, createShare, getShare};