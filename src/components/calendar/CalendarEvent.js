import React from 'react'

export const CalendarEvent = ({ event }) => {

    const { title } = event

    return (
        <div>
            <strong> {title} </strong>
            {/* <span>- {user.name} </span> */}
        </div>
    )
}