
let headings = [];
let ageGroupIndex = 0;
let literatePersons = 0;
const educationCategoryindexs = [];
const educationCategoryDict = [];
const educationCategoryHeading = [];
const ageMapDict = {};
let fileNo = 0;
const fs = require('fs');
const readline = require('readline');
const stream = require('stream');

const csvToRead = ['./India2011.csv', './IndiaSC2011.csv', './IndiaST2011.csv'];

function getEducationCategoryValues(heading) {
  for (let i = 0; i < heading.length; i += 1) {
    let headingComponents = heading[i].split('-');
    if ((headingComponents[0]).trim().localeCompare('Educational level') === 0) {
      if (headingComponents.length > 3) {
        headingComponents = headingComponents.slice(1, headingComponents.length - 1);
        if (!(headingComponents.join(' - ') in educationCategoryDict)) {
          educationCategoryDict[headingComponents.join(' - ')] = 0;
          educationCategoryHeading.push(headingComponents.join(' - '));
        }
      } else if (!(headingComponents[1] in educationCategoryDict)) {
        educationCategoryHeading.push(headingComponents[1]);
        educationCategoryDict[headingComponents[1]] = 0;
      }
      educationCategoryindexs.push(i);
      i += 2;
    }
  }
}

function consolidateData(line) {
  const dataLine = line.split(',');
  if (!(dataLine[ageGroupIndex] in ageMapDict)) {
    ageMapDict[dataLine[ageGroupIndex]] = parseInt(dataLine[literatePersons], 10);
  } else {
    ageMapDict[dataLine[ageGroupIndex]] += parseInt(dataLine[literatePersons], 10);
  }

  Object.keys(educationCategoryHeading).forEach((data) => {
    educationCategoryDict[educationCategoryHeading[data]] += parseInt(dataLine[educationCategoryindexs[data]], 10);
  });
}


function getHeadingValues(line) {
  headings = line.split(',');
  ageGroupIndex = headings.indexOf('Age-group');
  literatePersons = headings.indexOf('Literate - Persons');
  getEducationCategoryValues(headings);
}

function writeAgeMapJson() {
  const ageMapFile = fs.createWriteStream('./age_map.json');
  ageMapFile.write('[\n');
  let isFirstEntery = true;
  Object.keys(ageMapDict).forEach((i) => {
    if (isFirstEntery) {
      ageMapFile.write(`{\n\t"age_group" : "${i}",\n\t"number" : ${ageMapDict[i]}}\n`);
      isFirstEntery = !isFirstEntery;
    } else { ageMapFile.write(`,{\n\t"age_group" : "${i}",\n\t"number" : ${ageMapDict[i]}}\n`); }
  });
  ageMapFile.write(']\n');
  ageMapFile.end();
}

function writeEducationCategory() {
  let isFirstEntery = true;

  const educationCategoryFile = fs.createWriteStream('./education_category.json');
  educationCategoryFile.write('[\n');
  Object.keys(educationCategoryDict).forEach((i) => {
    if (isFirstEntery) {
      educationCategoryFile.write(`{\n\t"Education_Category" : "${i}",\n\t"number" : ${educationCategoryDict[i]}\n}\n`);
      isFirstEntery = !isFirstEntery;
    } else { educationCategoryFile.write(`,{\n\t"Education_Category" : "${i}",\n\t"number" : ${educationCategoryDict[i]}\n}\n`); }
  });
  educationCategoryFile.write(']\n');
  educationCategoryFile.end();
}


function readAsync(file_num = 0) {
  let isheading = true;
  function main(line) {
    if (isheading) {
      if (fileNo === 0) { getHeadingValues(line); }
      isheading = false;
    } else {
      consolidateData(line);
    }
  }


  // var instream = fs.createReadStream('./india2011.csv');
  const instream = fs.createReadStream(csvToRead[file_num]);
  const outstream = new stream();
  const rl = readline.createInterface(instream, outstream);
  rl.on('line', (line) => {
    main(line);
  });
  rl.on('close', (line) => {
    fileNo += 1;
    if (fileNo === 3) {
      writeAgeMapJson();
      writeEducationCategory();
    }
  });
}
readAsync(0);
readAsync(1);
readAsync(2);
