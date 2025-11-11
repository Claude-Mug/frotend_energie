import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import 'primeicons/primeicons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from '../../utils/axios';
import { fetchUltrasonicData } from './ListeUltrasonicPage';
import moment from 'moment';

// Importations des composants PrimeReact
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'primereact/calendar';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

Chart.register(...registerables);

const GraphiqueUltrasonicPage = () => {
  const distanceCanvasRef = useRef(null);
  const distanceChartRef = useRef(null);
  const navigate = useNavigate();

  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('23:59');

  const [disabledDates, setDisabledDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);

  // Récupération de toutes les données au chargement du composant
  useEffect(() => {
    const getInitialData = async () => {
      setLoading(true);
      try {
        const rawData = await fetchUltrasonicData();
        setAllData(rawData);

        if (rawData.length > 0) {
          const availableDatesStrings = new Set(rawData.map(d => moment(d.datetime).format('YYYY-MM-DD')));
          const firstDate = moment(rawData[0].datetime).startOf('day');
          const lastDate = moment(rawData[rawData.length - 1].datetime).startOf('day');
          const allDates = [];
          const currentDate = moment(firstDate);
          while (currentDate.isSameOrBefore(lastDate)) {
            allDates.push(currentDate.clone().toDate());
            currentDate.add(1, 'day');
          }

          const datesToDisable = allDates.filter(date => !availableDatesStrings.has(moment(date).format('YYYY-MM-DD')));
          setDisabledDates(datesToDisable);
          
          const defaultData = rawData.slice(-15);
          setFilteredData(defaultData);

          const firstRecordMoment = moment(defaultData[0].datetime);
          const lastRecordMoment = moment(defaultData[defaultData.length - 1].datetime);
          setStartDate(firstRecordMoment.toDate());
          setEndDate(lastRecordMoment.toDate());
          setStartTime(firstRecordMoment.format('HH:mm'));
          setEndTime(lastRecordMoment.format('HH:mm'));
        } else {
          setFilteredData([]);
        }
      } catch (err) {
        setError("Erreur lors de la récupération initiale des données.");
      } finally {
        setLoading(false);
      }
    };
    getInitialData();
  }, []);

  // Générer la liste des heures et minutes disponibles en fonction de la plage de dates sélectionnée
  useEffect(() => {
    if (!startDate || !endDate || allData.length === 0) {
      setAvailableTimes([]);
      return;
    }
  
    const startOfDay = moment(startDate).startOf('day');
    const endOfDay = moment(endDate).endOf('day');
  
    const timesInPeriod = allData.filter(d => 
      moment(d.datetime).isBetween(startOfDay, endOfDay, null, '[]')
    ).map(d => moment(d.datetime).format('HH:mm'));
  
    const uniqueTimes = Array.from(new Set(timesInPeriod)).sort();
    setAvailableTimes(uniqueTimes);
  }, [startDate, endDate, allData]);

  // Fonction de filtrage manuel
  const handleApplyFilter = () => {
    if (allData.length === 0 || !startDate || !endDate) {
      setFilteredData([]);
      return;
    }

    const startDateTime = moment(startDate).set({
      'hour': moment(startTime, 'HH:mm').hour(),
      'minute': moment(startTime, 'HH:mm').minute(),
      'second': 0
    });
    const endDateTime = moment(endDate).set({
      'hour': moment(endTime, 'HH:mm').hour(),
      'minute': moment(endTime, 'HH:mm').minute(),
      'second': 59
    });

    if (startDateTime.isSameOrBefore(endDateTime)) {
      const filteredRecords = allData.filter(d => {
        const recordDateTime = moment(d.datetime);
        return recordDateTime.isBetween(startDateTime, endDateTime, null, '[]');
      });
      setFilteredData(filteredRecords);
    } else {
      setFilteredData([]);
    }
  };

  // Ajout de la fonction pour valider les dates sélectionnées
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
  
  // Génération des graphiques quand les données filtrées changent
  useEffect(() => {
    if (distanceChartRef.current) distanceChartRef.current.destroy();
    
    if (!filteredData.length) return;

    const chartOptions = (titleText, yAxisLabel, tooltipCallback) => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: { display: true, text: 'Date et Heure' },
          grid: { display: false },
        },
        y: {
          title: { display: true, text: yAxisLabel },
          grid: { color: 'rgba(0, 0, 0, 0.1)' },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: 10,
          callbacks: { label: tooltipCallback },
        },
        title: {
          display: true,
          text: titleText,
          font: { size: 16, weight: 'bold' },
        },
      },
    });

    const distanceData = {
      labels: filteredData.map(d => moment(d.datetime).format('DD/MM HH:mm')),
      datasets: [
        {
          label: 'Distance',
          data: filteredData.map(d => d.distance_cm),
          backgroundColor: filteredData.map(d => {
            const distance = d.distance_cm;
            if (distance < 50) return 'rgba(255, 99, 132, 0.8)';
            if (distance < 100) return 'rgba(255, 159, 64, 0.8)';
            return 'rgba(75, 192, 192, 0.8)';
          }),
          borderColor: 'rgba(255, 255, 255, 0.5)',
          borderWidth: 1,
          borderRadius: 5,
        },
      ],
    };
    
    const distanceTooltipCallback = (context) => {
      const record = filteredData[context.dataIndex];
      return [
        `Date/Heure: ${moment(record.datetime).format('DD/MM/YYYY HH:mm')}`,
        `Distance: ${record.distance_cm.toFixed(1)} cm`,
      ];
    };
    const distanceOptions = chartOptions('Variation de distance par enregistrement', 'Distance (cm)', distanceTooltipCallback);
    
    if (distanceCanvasRef.current) {
      distanceChartRef.current = new Chart(distanceCanvasRef.current, {
        type: 'bar',
        data: distanceData,
        options: distanceOptions,
      });
    }

  }, [filteredData]);

  const handleLast15Records = () => {
    if (allData.length === 0) return;
    const defaultData = allData.slice(-15);
    setFilteredData(defaultData);

    if (defaultData.length > 0) {
      const firstRecordMoment = moment(defaultData[0].datetime);
      const lastRecordMoment = moment(defaultData[defaultData.length - 1].datetime);
      setStartDate(firstRecordMoment.toDate());
      setEndDate(lastRecordMoment.toDate());
      setStartTime(firstRecordMoment.format('HH:mm'));
      setEndTime(lastRecordMoment.format('HH:mm'));
    }
  };

  return (
    <div className="container py-4">
      <div className="text-center mb-4">
        <h1>Dashboard de Données Ultrasoniques</h1>
        <p className="lead">Visualisation de la distance</p>
        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate('/dht11')} // Route vers la table
        >
          <i className="pi pi-table me-2"></i>
          Voir la table des données
        </button>
      </div>

      <div className="row mb-4 bg-black opacity-75 p-3 rounded shadow-sm text-white">
        <div className="col-md-3 mb-2">
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
        <div className="col-md-3 mb-2">
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
        <div className="col-md-3 mb-2">
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
        <div className="col-md-3 mb-2">
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
        <div className="col-md-6 d-flex align-items-end mt-2">
          <button
            className="btn btn-primary w-100"
            onClick={handleApplyFilter}
            disabled={!startDate || !endDate}
          >
            <i className="pi pi-filter me-2"></i>
            Filtrer
          </button>
        </div>
        <div className="col-md-6 d-flex align-items-end mt-2">
           <button
            className="btn btn-secondary w-100"
            onClick={handleLast15Records}
          >
            <i className="pi pi-history me-2"></i>
            Afficher les 15 derniers
          </button>
        </div>
      </div>

      {loading && (
        <div className="alert alert-info text-center">
          Chargement des données...
        </div>
      )}

      {error && (
        <div className="alert alert-danger text-center">
          {error}
        </div>
      )}

      {filteredData.length > 0 && !loading && (
        <div className="row">
          <div className="col-12 mb-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center border-0 rounded-top">
                <div>
                  <i className="pi pi-compass me-2"></i>
                  **Distance (cm)**
                </div>
              </div>
              <div className="card-body" style={{ position: 'relative', height: '400px' }}>
                <canvas ref={distanceCanvasRef}></canvas>
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredData.length === 0 && !loading && !error && (
          <div className="alert alert-warning text-center">
              Aucun enregistrement trouvé pour la période sélectionnée.
          </div>
      )}
    </div>
  );
};

export default GraphiqueUltrasonicPage;