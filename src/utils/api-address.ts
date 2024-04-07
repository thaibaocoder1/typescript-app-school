interface Province {
  province_id: string;
  province_name: string;
  province_type: string;
}
interface District {
  district_id: string;
  district_name: string;
}
interface Ward {
  ward_id: string;
  ward_name: string;
}

async function handleChangeProvince(e: Event) {
  const target = e.target as HTMLSelectElement;
  const provinceID = target.value;
  try {
    if (typeof provinceID === "string" && provinceID !== "") {
      await getAllDistricts(provinceID, "district");
    } else {
      const wardElement = document.getElementById("ward") as HTMLSelectElement;
      const districtElement = document.getElementById(
        "district"
      ) as HTMLSelectElement;
      wardElement.innerHTML = `<option value="">Select one ward</option>`;
      districtElement.innerHTML = `<option value="">Select one district</option>`;
    }
  } catch (error) {
    console.log(error);
  }
}
async function handleChangeWard(e: Event) {
  const target = e.target as HTMLSelectElement;
  const districtID = target.value;
  try {
    if (districtID && districtID !== "") {
      await getAllWards(districtID, "ward");
    } else {
      const wardElement = document.getElementById("ward") as HTMLSelectElement;
      wardElement.innerHTML = `<option value="">Select one ward</option>`;
    }
  } catch (error) {
    console.log(error);
  }
}

async function getAllDistricts(provinceID: string, selector: string) {
  const districtElement = document.getElementById(
    selector
  ) as HTMLSelectElement;
  districtElement.innerHTML = `<option value="">Select one district</option>`;
  try {
    const response = await fetch(
      "https://vapi.vnappmob.com/api/province/district/" + provinceID
    );
    const data = await response.json();
    const results: Array<District> = data.results;
    results.forEach((district) => {
      const optionEl = document.createElement("option");
      optionEl.dataset.value = district.district_name;
      optionEl.value = district.district_id;
      optionEl.text = district.district_name;
      districtElement.add(optionEl);
    });
    districtElement.addEventListener("change", handleChangeWard);
  } catch (error) {
    console.error("Error:", error);
  }
}
async function getAllWards(districtID: string, selector: string) {
  const wardElement = document.getElementById(selector) as HTMLSelectElement;
  wardElement.innerHTML = `<option value="">Select one ward</option>`;
  try {
    const response = await fetch(
      "https://vapi.vnappmob.com/api/province/ward/" + districtID
    );
    const data = await response.json();
    const results: Array<Ward> = data.results;
    results.forEach((ward) => {
      const optionEl = document.createElement("option");
      optionEl.dataset.value = ward.ward_name;
      optionEl.value = ward.ward_id;
      optionEl.text = ward.ward_name;
      wardElement.add(optionEl);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function getAllProvinces(selector: string) {
  const provinceElement = document.getElementById(
    selector
  ) as HTMLSelectElement;
  provinceElement.innerHTML = `<option value="">Select one province</option>`;
  try {
    const response = await fetch("https://vapi.vnappmob.com/api/province/");
    const data = await response.json();
    const results: Array<Province> = data.results;
    results.forEach((province) => {
      const optionEl = document.createElement("option");
      optionEl.dataset.value = province.province_name;
      optionEl.value = province.province_id;
      optionEl.text = province.province_name;
      provinceElement.add(optionEl);
    });
    provinceElement.addEventListener("change", handleChangeProvince);
  } catch (error) {
    console.error("Error:", error);
  }
}
