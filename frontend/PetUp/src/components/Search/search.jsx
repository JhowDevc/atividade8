import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import React from 'react';
import './search.css';

function Search() {
  return (
    <div className="search-wrapper">
      <section className="container search py-5 text-align-center text-center justify-content-center">
        <div className="row">
          <h2 className="pb-3">Encontre seu amigo rapidamente</h2>
          <div className="search-bar d-lg-flex d-block align-items-center justify-content-between py-3 px-3 mt-3">
            <input className="p-2" type="text" placeholder="Descreva as características do pet" />
            <select className="m-3 m-lg-0">
              <option>Espécie</option>
              <option>Cão</option>
              <option>Gato</option>
            </select>
            <button>Buscar</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Search;
