import React, { useEffect, useState } from 'react'
import moment from 'moment'
import Modal from 'react-modal'
import DateTimePicker from 'react-datetime-picker'
import Swal from 'sweetalert2'
import { useDispatch, useSelector } from 'react-redux'
import { uiCloseModal } from '../../actions/ui'
import { eventClearActiveEvent, eventStartAddNew, eventStartUpdate } from '../../actions/events'

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
}

Modal.setAppElement('#root')

const now = moment().minutes(0).seconds(0).add(1, 'hours')
const nowPlus1 = now.clone().add(1, 'hours')


const initEvent = {
    title: '',
    notes: '',
    start: now.toDate(),
    end: nowPlus1.toDate()
}

export const CalendarModal = () => {

    const dispatch = useDispatch()

    const { modalOpen } = useSelector(state => state.ui)
    const { activeEvent } = useSelector(state => state.calendar)

    const [dateStart, setDateStart] = useState(now.toDate())
    const [dateEnd, setDateEnd] = useState(nowPlus1.toDate())
    const [titleValid, setTitleValid] = useState(true)

    const [formValues, setFormValues] = useState(initEvent)

    const { notes, title, start, end } = formValues

    useEffect(() => {
        if (activeEvent) {
            setFormValues(activeEvent)
        } else {
            setFormValues(initEvent)
        }
    }, [activeEvent, setFormValues])

    const handleInputChange = ({ target }) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value
        })
    }

    const closeModal = () => {
        dispatch(uiCloseModal())
        dispatch(eventClearActiveEvent())
        setFormValues(initEvent)
    }

    const handleStartDateChange = (e) => {
        setDateStart(e)
        setFormValues({
            ...formValues,
            start: e
        })
    }

    const handleEndDateChange = (e) => {
        setDateEnd(e)
        setFormValues({
            ...formValues,
            end: e
        })
    }

    const handleSubmitForm = (e) => {
        e.preventDefault()

        const momentStart = moment(start)
        const momentEnd = moment(end)

        if (momentStart.isSameOrAfter(momentEnd)) {
            console.log('joder');
            Swal.fire('Error', 'The end date must be after the start date', 'error')
            return
        }

        if (title.trim().length < 2) {
            return setTitleValid(false)
        }

        //TODO: realizar grabación en DB

        if (activeEvent) {
            dispatch(eventStartUpdate(formValues))
        } else {
            dispatch(eventStartAddNew(formValues))
        }

        setTitleValid(true)
        closeModal()
    }

    return (
        <Modal
            isOpen={modalOpen}
            onRequestClose={closeModal}
            style={customStyles}
            closeTimeoutMS={200}
            className="modal"
            overlayClassName="modal-fondo"
        >
            <h1> {(activeEvent) ? 'Edit Event' : 'New event'} </h1>
            <hr />
            <form className="container" >

                <div className="form-group">
                    <label>Start date</label>
                    <DateTimePicker
                        onChange={handleStartDateChange}
                        value={dateStart}
                        className="form-control"
                        disableClock={false}
                    />
                </div>

                <div className="form-group">
                    <label>End date</label>
                    <DateTimePicker
                        onChange={handleEndDateChange}
                        value={dateEnd}
                        minDate={dateStart}
                        className="form-control"
                    />
                </div>

                <hr />
                <div className="form-group">
                    <label> Title and Notes</label>
                    <input
                        type="text"
                        className={`form-control ${!titleValid && 'is-invalid'}`}
                        placeholder="Event title"
                        name="title"
                        autoComplete="off"
                        value={title}
                        onChange={handleInputChange}
                    />
                    <small id="emailHelp" className="form-text text-muted">A short description</small>
                </div>

                <div className="form-group">
                    <textarea
                        type="text"
                        className="form-control"
                        placeholder="Notes"
                        rows="5"
                        name="notes"
                        value={notes}
                        onChange={handleInputChange}
                    ></textarea>
                    <small id="emailHelp" className="form-text text-muted">Additional information</small>
                </div>

                <button
                    type="button"
                    className="btn btn-outline-primary btn-block"
                    onClick={handleSubmitForm}
                >
                    <i className="far fa-save"></i>
                    <span> Save </span>
                </button>

            </form>
        </Modal>
    )
}
