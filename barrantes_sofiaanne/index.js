let menuIcon = document.getElementById('menu-icon');
let navbar = document.querySelector('.navbar');
let sections = document.querySelectorAll('section');
let navlinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navlinks.forEach(link => {
                link.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
            });
        }
    });
}

menuIcon.addEventListener('click', () => {
    navbar.classList.toggle('active');
});
  
  function searchCountry() {
      let countryName = document.getElementById("countryInput").value.trim();
      if (!countryName) {
        document.getElementById("countryDetails").innerHTML =
          "<p>Please enter a country name.</p>";
        document.getElementById("sameRegionCountries").innerHTML = "";
        return;
      }
    
      fetch("https://restcountries.com/v3.1/name/" + countryName)
        .then(function (response) {
          if (!response.ok) {
            throw new Error("Country not found");
          }
          return response.text();
        })
        .then(function (countryData) {
          let country = JSON.parse(countryData)[0];
          let details = `<h2>Country Details - ${country.name.common}</h2>
            <img src="${country.flags.svg}" alt="Flag of
               ${country.name.common}" width="100">
  
            <p><strong>Area:</strong> 
              ${country.area ? country.area.toLocaleString() + 
                " square kilometers" : "N/A"}
            </p>
  
            <p><strong>Languages:</strong> 
              ${country.languages ? Object.values(country.languages)
                  .join(", ") : "N/A"}
            </p>
  
            <p><strong>Subregion:</strong> ${country.subregion ? 
              country.subregion : "N/A"}
            </p>
  
            <p><strong>Capital:</strong>
              ${country.capital ? country.capital[0] : "N/A"}
            </p>
  
            <p><strong>Timezones:</strong> 
              ${country.timezones ? country.timezones.join(", ") : "N/A"}
            </p>
          `;
    
          document.getElementById("countryDetails").innerHTML = details;
    
          return fetch("https://restcountries.com/v3.1/region/" + country.region)
            .then(function (response) {
              if (!response.ok) {
                throw new Error("Region not found");
              }
              return response.text();
            })
            .then(function (regionData) {
              let region = JSON.parse(regionData)[0].region;
              let sameRegionCountriesList = "";
    
              for (let c of JSON.parse(regionData)) {
                sameRegionCountriesList += `
                  <div class="country-card">
                    <img src="${c.flags.svg}" alt="Flag of ${c.name.common}
                             " width="50">
                    <p>${c.name.common}</p>
                  </div>
                `;
              }
    
              document.getElementById("sameRegionCountries").innerHTML = `
                <h2>Countries in the Same Region (${region})</h2>
                <div class="country-list">${sameRegionCountriesList}</div>
              `;
            })
            .catch(function (error) {
              console.error("Error fetching data:", error);
              document.getElementById("countryDetails").innerHTML = 
                      "<p>An error occurred: " + error.message + "</p>";
              document.getElementById("sameRegionCountries").innerHTML = "";
            });
        });
    }
    