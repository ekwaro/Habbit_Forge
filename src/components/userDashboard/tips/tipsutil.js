import { useEffect, useState } from "react"



const useTip=()=>{
    const [tip, setTip] = useState([])
const [loading, setLoading] = useState(false)
const [error, setError] = useState('')

const fetchTip=async()=>{
    setLoading(true)
    setError('')

    try{
        const res = await fetch("https://api.allorigins.win/get?url=https://zenquotes.io/api/random")
        if(!res.ok)throw new Error('Failed to fetch Tip')
        const data = await res.json()
        setTip(data[0])
    }
    catch(err){
        setError('Could not fetch tip, please try again')
    }
    finally{
        setLoading(false)
    }

}

useEffect(()=>{
    fetchTip();
},[]);

return {tip, loading, error, fetchTip}

}



export default useTip