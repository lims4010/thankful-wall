import React from 'react';
import { useAppContext } from '../../context/AppContext';

const Alert = () => {
  const { alerts } = useAppContext();
  
  return (
    alerts !== null &&
    alerts.length > 0 &&
    alerts.map(alert => (
      <div key={alert.id} className={`alert alert-${alert.alertType}`}>
        {alert.msg}
      </div>
    ))
  );
};

export default Alert;
