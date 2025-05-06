import '../styles/component_styles/ShowingDetails.css';

function ShowingDetails({ movie, showing }) {
  return (
    <div className="booking-details-wrapper" key={showing.showing_id}>
      {movie?.poster_url && (
        <img
          src={movie.poster_url}
          alt={movie.title}
          className="showing-poster"
        />
      )}
      <div className="booking-info">
        <h3>{showing.title || 'Title not available'}</h3>
        <p>
          Theater {showing.theater_id || 'N/A'} |{' '}
          {movie?.length_minutes ? `${movie.length_minutes} min` : 'N/A'}
        </p>
        <p>
          Time:{' '}
          {showing.showing_time ? (
            <>
              {new Date(showing.showing_time).toLocaleDateString()} |{' '}
              {new Date(showing.showing_time).toLocaleTimeString()}
            </>
          ) : (
            'N/A'
          )}
        </p>
      </div>
    </div>
  );
}

export default ShowingDetails;
