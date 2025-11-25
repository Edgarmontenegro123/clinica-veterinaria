import './css/CatSpinner.css';

const CatSpinner = () => {
  return (
    <div className="cat-spinner-container">
      <div className="cat">
        <div className="cat-head">
          <div className="cat-ears">
            <div className="cat-ear cat-ear-left"></div>
            <div className="cat-ear cat-ear-right"></div>
          </div>
          <div className="cat-face">
            <div className="cat-eyes">
              <div className="cat-eye cat-eye-left">
                <div className="cat-pupil"></div>
              </div>
              <div className="cat-eye cat-eye-right">
                <div className="cat-pupil"></div>
              </div>
            </div>
            <div className="cat-nose"></div>
            <div className="cat-mouth">
              <div className="cat-mouth-line cat-mouth-line-left"></div>
              <div className="cat-mouth-line cat-mouth-line-right"></div>
            </div>
          </div>
        </div>
        <div className="cat-body">
          <div className="cat-tail"></div>
        </div>
      </div>
      <div className="loading-text">Cargando mascotas...</div>
      <div className="loading-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default CatSpinner;
