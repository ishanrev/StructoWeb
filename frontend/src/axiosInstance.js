// const axiosLink = "http://localhost:3001/api"
let axiosLink;
if (process.env.NODE_ENV === "production") {
    axiosLink = "http://structo-f75c6d12164f.herokuapp.com/"

} else {

    axiosLink = "http://localhost:3001/api" 
}

export default axiosLink