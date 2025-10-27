import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

export default function Home() {
    return (
        <>
            <header className="container text-center" style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: '20px',
                padding: '4rem 2rem',
                marginTop: '2rem',
                marginBottom: '3rem',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
            }}>
                <h1 className="mb-4" style={{ fontSize: '3.5rem', fontWeight: '700', color: 'white' }}>
                    Welcome to FitLog
                </h1>
                <p className="lead" style={{
                    fontSize: '1.4rem',
                    fontWeight: '400',
                    color: 'white'
                }}>
                    Track your workouts, set personal goals, and stay motivated on your fitness journey.
                </p>
            </header>

            <section className="container py-3 text-center">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <h2 className="mb-3">Log your workouts.</h2>
                        <p className="mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                            Log all of your fitness: We've got it all, from cardio to weightlifting to much more.
                            Use our workout log to record your daily workouts and progress.
                        </p>
                    </div>
                </div>
            </section>

            <section className="container py-3 text-center">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <h2 className="mb-3">Set fitness goals.</h2>
                        <p className="mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                            Turn those goals into reality: Define your goals and track your progress in our fitness goal tracker.
                        </p>
                    </div>
                </div>
            </section>
        </>
    )
}