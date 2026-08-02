export const RaceEvents = () => {
    return (
        <div className="card" style={{ marginTop: '1rem', background: 'var(--color-panel)'}}>
            <div className="card-header" style={{ background: 'var(--color-panel)', color: 'var(--color-text)', marginTop: '0.5rem'}}>
                <h5 className="card-title" style={{color: 'var(--color-text)', textTransform: 'uppercase', fontWeight: 'bold'}}>Eventos</h5>
            </div>
            <div className={`card-body`}>
                <div className="row">
                    <div className="col">

                    </div>
                    <div className="col-md-10" style={{ color: 'var(--color-text)' }}>
                        <span>Lewis Hamilton ha entrado a boxes.</span>
                    </div>
                </div>
                
                <div className="card mb-3">
                    <div className="row g-0">
                        <div className="col-md-4">
                        <img src="..." className="img-fluid rounded-start" alt="..." />
                        </div>
                        <div className="col-md-8">
                        <div className="card-body">
                            <h5 className="card-title">Card title</h5>
                            <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                            <p className="card-text"><small className="text-body-secondary">Last updated 3 mins ago</small></p>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};