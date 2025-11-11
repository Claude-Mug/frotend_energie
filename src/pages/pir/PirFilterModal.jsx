// src/pages/pir/PirFilterModal.jsx

import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import moment from 'moment';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const PirFilterModal = ({ visible, onHide, onApplyFilter, data, initialStartDate, initialEndDate }) => {
    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);
    const [startTime, setStartTime] = useState('00:00');
    const [endTime, setEndTime] = useState('23:59');
    const [availableTimes, setAvailableTimes] = useState([]);
    const [disabledDates, setDisabledDates] = useState([]);

    useEffect(() => {
        // Synchroniser l'état local avec les props initiales
        if (initialStartDate) setStartDate(initialStartDate);
        if (initialEndDate) setEndDate(initialEndDate);
    }, [initialStartDate, initialEndDate]);

    useEffect(() => {
        // Initialiser les dates disponibles pour le calendrier
        if (data && data.length > 0) {
            const availableDatesStrings = new Set(data.map(d => moment(d.datetime).format('YYYY-MM-DD')));
            const allDates = [];
            let currentDate = moment(data[0].datetime).startOf('day');
            const lastDate = moment(data[data.length - 1].datetime).startOf('day');
            while (currentDate.isSameOrBefore(lastDate)) {
                allDates.push(currentDate.clone().toDate());
                currentDate.add(1, 'day');
            }
            const datesToDisable = allDates.filter(date => !availableDatesStrings.has(moment(date).format('YYYY-MM-DD')));
            setDisabledDates(datesToDisable);
        }
    }, [data]);

    useEffect(() => {
        // Mettre à jour les heures disponibles en fonction des dates sélectionnées
        if (startDate && endDate && data && data.length > 0) {
            const startOfDay = moment(startDate).startOf('day');
            const endOfDay = moment(endDate).endOf('day');
            const timesInPeriod = data.filter(d => 
                moment(d.datetime).isBetween(startOfDay, endOfDay, null, '[]')
            ).map(d => moment(d.datetime).format('HH:mm'));
            const uniqueTimes = Array.from(new Set(timesInPeriod)).sort();
            setAvailableTimes(uniqueTimes);
            if (uniqueTimes.length > 0) {
                setStartTime(uniqueTimes[0]);
                setEndTime(uniqueTimes[uniqueTimes.length - 1]);
            } else {
                setStartTime('00:00');
                setEndTime('23:59');
            }
        } else {
            setAvailableTimes([]);
            setStartTime('00:00');
            setEndTime('23:59');
        }
    }, [startDate, endDate, data]);

    const handleDateChange = (value, setter) => {
        if (value) {
            const isDateDisabled = disabledDates.some(d => moment(d).isSame(moment(value), 'day'));
            if (!isDateDisabled) {
                setter(value);
            }
        } else {
            setter(null);
        }
    };

    const handleApply = () => {
        if (!startDate || !endDate) {
            // Optionnel : Gérer le cas où les dates sont vides
            console.log("Les dates de début et de fin sont requises.");
            return;
        }
        
        console.log("Appel de onApplyFilter avec les paramètres :", { startDate, endDate, startTime, endTime });
        onApplyFilter(startDate, endDate, startTime, endTime);
        onHide();
    };

    const renderFooter = () => (
        <div>
            <Button
                label="Annuler"
                icon="pi pi-times"
                onClick={onHide}
                className="p-button-text p-button-secondary bg-danger-subtle"
            />
            <Button
                label="Filtrer"
                className='text-black bg-info-subtle'
                icon="pi pi-check"
                onClick={handleApply}
                disabled={!startDate || !endDate} // Désactiver si les dates ne sont pas sélectionnées
                autoFocus
            />
        </div>
    );

    return (
        <Dialog
            header="Filtrer par date et heure"
            visible={visible}
            onHide={onHide}
            footer={renderFooter()}
            style={{ width: '40vw' }}
            breakpoints={{ '960px': '75vw', '640px': '100vw' }}
        >
            <div className="row g-3">
                <div className="col-md-6">
                    <label htmlFor="start-date" className="form-label">Date de début</label>
                    <Calendar
                        value={startDate}
                        onChange={(e) => handleDateChange(e.value, setStartDate)}
                        dateFormat="dd/mm/yy"
                        placeholder="Sélectionnez une date"
                        className="w-100"
                        showIcon
                        disabledDates={disabledDates}
                        readOnlyInput
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="start-time" className="form-label">Heure de début</label>
                    <select
                        className="form-control"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                    >
                        {availableTimes.map(time => (
                            <option key={time} value={time}>{time}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-6">
                    <label htmlFor="end-date" className="form-label">Date de fin</label>
                    <Calendar
                        value={endDate}
                        onChange={(e) => handleDateChange(e.value, setEndDate)}
                        dateFormat="dd/mm/yy"
                        placeholder="Sélectionnez une date"
                        className="w-100"
                        showIcon
                        disabledDates={disabledDates}
                        readOnlyInput
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="end-time" className="form-label">Heure de fin</label>
                    <select
                        className="form-control"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                    >
                        {availableTimes.map(time => (
                            <option key={time} value={time}>{time}</option>
                        ))}
                    </select>
                </div>
            </div>
        </Dialog>
    );
};

export default PirFilterModal;