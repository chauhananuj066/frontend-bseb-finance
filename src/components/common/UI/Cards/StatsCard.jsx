import React from 'react';
import { Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import classNames from 'classnames';
import './StatsCard.scss';

const StatsCard = ({
  title,
  value,
  change,
  changeType = 'positive', // positive, negative, neutral
  icon,
  color = 'primary',
  loading = false,
  className = '',
  onClick,
}) => {
  const cardClasses = classNames(
    'stats-card',
    `stats-card-${color}`,
    {
      'stats-card-clickable': onClick,
      'stats-card-loading': loading,
    },
    className
  );

  const changeClasses = classNames(
    'stats-change',
    `text-${changeType === 'positive' ? 'success' : changeType === 'negative' ? 'danger' : 'muted'}`
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={onClick ? { y: -4, transition: { duration: 0.2 } } : undefined}
    >
      <Card className={cardClasses} onClick={onClick}>
        <Card.Body>
          <div className="stats-card-content">
            <div className="stats-info">
              <div className="stats-title">{title}</div>
              <div className="stats-value">
                {loading ? <div className="stats-skeleton"></div> : value}
              </div>
              {change && !loading && (
                <div className={changeClasses}>
                  <span className="stats-change-icon">
                    {changeType === 'positive' ? '↗' : changeType === 'negative' ? '↘' : '→'}
                  </span>
                  {change}
                </div>
              )}
            </div>

            {icon && <div className="stats-icon">{icon}</div>}
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default StatsCard;
