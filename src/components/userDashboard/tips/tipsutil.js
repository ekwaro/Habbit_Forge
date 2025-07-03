import { useEffect, useState } from "react"



const useTip=()=>{
    const [tips, setTips] = useState([])
const [loading, setLoading] = useState(false)
const [error, setError] = useState('')

const fetchTip=async()=>{
    setLoading(true)
    setError('')

    try{
        const res = await fetch("http://localhost:1337/api/tips")
        if(!res.ok)throw new Error('Failed to fetch Tip')
        const data = await res.json()
        setTips(data.data)
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

return {tips, loading, error, fetchTip}

}



export default useTip