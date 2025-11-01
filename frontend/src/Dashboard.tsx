import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Gift,
  Users,
  Upload,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import BirthdayCard from './BirthdayCard';
import FileUpload from './FileUpload';
import StatsCard from './StatsCard';
import { Statistics, UpcomingBirthday } from './entities';
import { birthdayApi } from './APIService';

const Dashboard: React.FC = () => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState<
    UpcomingBirthday[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'upcoming' | 'upload'
  >('overview');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [stats, upcoming] = await Promise.all([
        birthdayApi.getStatistics(),
        birthdayApi.getUpcomingBirthdays(30),
      ]);
      setStatistics(stats);
      setUpcomingBirthdays(upcoming);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    loadData();
  };

  const containerStyle = {
    minHeight: '100vh',
    background:
      'linear-gradient(135deg, #14b8a6 0%, #06b6d4 25%, #0891b2 50%, #0e7490 75%, #155e75 100%)',
    padding: '32px',
  };

  const glassStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '24px',
  };

  const buttonActiveStyle = {
    background: 'white',
    color: '#7c3aed',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    transform: 'scale(1.05)',
  };

  const buttonInactiveStyle = {
    background: 'transparent',
    color: 'rgba(255, 255, 255, 0.7)',
  };

  if (loading) {
    return (
      <div
        style={{
          ...containerStyle,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <div style={{ position: 'relative' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              border: '4px solid rgba(255, 255, 255, 0.3)',
              borderTop: '4px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}></div>
          <Sparkles
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
            }}
            size={24}
          />
        </div>
        <p
          style={{
            marginTop: '24px',
            color: 'white',
            fontSize: '18px',
            fontWeight: '500',
          }}>
          Lade Geburtstage...
        </p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ ...glassStyle, padding: '48px' }}>
            <h1
              style={{
                fontSize: '4rem',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
              }}>
              🎉 Gifty McGiftface
              <Sparkles style={{ color: '#fbbf24' }} size={48} />
            </h1>
            <p style={{ fontSize: '20px', color: 'rgba(255, 255, 255, 0.8)' }}>
              Nie wieder einen Geburtstag vergessen!
            </p>
          </div>
        </header>

        {/* Navigation */}
        <nav style={{ marginBottom: '32px' }}>
          <div style={{ ...glassStyle, padding: '8px' }}>
            <div
              style={{
                display: 'flex',
                gap: '8px',
                flexDirection: window.innerWidth < 640 ? 'column' : 'row',
              }}>
              {(['overview', 'upcoming', 'upload'] as const).map((tab) => (
                <button
                  key={tab}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    fontWeight: '500',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    ...(activeTab === tab
                      ? buttonActiveStyle
                      : buttonInactiveStyle),
                  }}
                  onClick={() => setActiveTab(tab)}>
                  {tab === 'overview' && <TrendingUp size={20} />}
                  {tab === 'upcoming' && <Calendar size={20} />}
                  {tab === 'upload' && <Upload size={20} />}
                  {tab === 'overview' && 'Übersicht'}
                  {tab === 'upcoming' && 'Kommende Geburtstage'}
                  {tab === 'upload' && 'Import'}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Content */}
        <main style={{ ...glassStyle, padding: '32px' }}>
          {activeTab === 'overview' && statistics && (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {/* Stats Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '24px',
                }}>
                <StatsCard
                  title="Gesamt Personen"
                  value={statistics.total}
                  icon={<Users size={24} />}
                  color="linear-gradient(135deg, #3b82f6, #2563eb)"
                />
                <StatsCard
                  title="Kommende Geburtstage"
                  value={statistics.upcomingCount}
                  icon={<Calendar size={24} />}
                  color="linear-gradient(135deg, #10b981, #059669)"
                />
                <StatsCard
                  title="Geschenke benötigt"
                  value={
                    statistics.upcoming.filter((b) => b.Todo === 'NEEDPRESENT')
                      .length
                  }
                  icon={<Gift size={24} />}
                  color="linear-gradient(135deg, #f59e0b, #d97706)"
                />
              </div>

              {/* Upcoming Preview */}
              <div>
                <h2
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}>
                  <Calendar size={24} style={{ color: '#fbbf24' }} />
                  Nächste Geburtstage
                </h2>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                    gap: '24px',
                  }}>
                  {statistics.upcoming.slice(0, 4).map((birthday) => (
                    <BirthdayCard key={birthday.id} birthday={birthday} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'upcoming' && (
            <div>
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}>
                <Calendar size={24} style={{ color: '#fbbf24' }} />
                Kommende Geburtstage (nächste 30 Tage)
              </h2>
              {upcomingBirthdays.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '64px 20px' }}>
                  <Calendar
                    size={64}
                    style={{
                      color: 'rgba(255, 255, 255, 0.5)',
                      margin: '0 auto 16px',
                    }}
                  />
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '18px',
                    }}>
                    Keine Geburtstage in den nächsten 30 Tagen
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}>
                  {upcomingBirthdays.map((birthday) => (
                    <BirthdayCard
                      key={birthday.id}
                      birthday={birthday}
                      detailed
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'upload' && (
            <div>
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}>
                <Upload size={24} style={{ color: '#fbbf24' }} />
                CSV Import
              </h2>
              <FileUpload onUploadSuccess={handleUploadSuccess} />
            </div>
          )}
        </main>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
