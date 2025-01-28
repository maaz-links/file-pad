import { useState, useEffect } from 'react';

export default function Expiry({unix=0}) {
    if(!unix) //var instead of const
    {    var targetDate = new Date("2025-01-15T23:59:59")}
    else{
        var targetDate = new Date(unix*1000)
    }
    const calculateTimeLeft = () => {
        const difference = targetDate - new Date();
        let timeLeft = {};
        if (difference > 0) {
            timeLeft = {
                //days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                //hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                hours: Math.floor((difference / (1000 * 60 * 60))),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
            //timeLeft.days = timeLeft.days < 9 ? `0${timeLeft.days}` : timeLeft.days;
            timeLeft.hours = timeLeft.hours < 10 ? `0${timeLeft.hours}` : timeLeft.hours;
            timeLeft.minutes = timeLeft.minutes < 10 ? `0${timeLeft.minutes}` : timeLeft.minutes;
            timeLeft.seconds = timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds;
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);
    return (
        <div className="expiry d-flex align-items-center gap-1 gap-md-2">
            {!Object.keys(timeLeft).length ?
                <p className='fw-bold fs-6 text-uppercase'>Time expired</p>
                :
                Object.keys(timeLeft).map((interval, index) => (
                    <div key={index} className="expiry-time d-flex align-items-center justify-content-center">
                        {timeLeft[interval]?.toString().split("").map((item, i) => (
                            <span key={i}>{item === "0" ? "0" : item}</span>
                        ))}
                    </div>
                ))
            }
        </div>
    )
}
