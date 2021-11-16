const uniq = (array) => {
  return array.filter((elem, index, self) => self.indexOf(elem) === index);
};

const lilyNodeBgColor = (lily) => {
  if (lily.status && lily.status.value === 'alive' && lily.class && lily.class.value === 'https://lily.fvhp.net/rdf/IRIs/lily_schema.ttl#Teacher') {
    return 'wheat'
  } else if (lily.status && lily.status.value === 'alive') {
    return 'paleturquoise';
  } else {
    return 'dimgray';
  }
};

const lilyNodeBorderColor = (lily) => {
  if (lily.class && lily.class.value === 'https://lily.fvhp.net/rdf/IRIs/lily_schema.ttl#Teacher') {
    return 'saddlebrown';
  } else {
    return 'dodgerblue';
  }
};
var response;
xhr = new XMLHttpRequest();
xhr.onload = function (e) {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      response = JSON.parse(xhr.responseText);
    }
  }
};
xhr.open('POST', 'https://lily.fvhp.net/sparql/query?format=json', false);
xhr.setRequestHeader('content-type', 'application/sparql-query;charset=UTF-8');
var request = `
PREFIX schema: <http://schema.org/>
PREFIX lily: <https://lily.fvhp.net/rdf/IRIs/lily_schema.ttl#>

SELECT ?s ?name ?status ?isBoosted ?garden ?legion ?schild ?schutzengel ?pastSchild ?pastSchutzengel ?youngerSchwester ?olderSchwester ?pastYoungerSchwester ?pastOlderSchwester ?roomMate ?sibling ?relationship ?class
WHERE{
VALUES ?class {lily:Lily lily:Character lily:Teacher}
?s a ?class;
schema:name ?name;
OPTIONAL{?s lily:lifeStatus ?status.}
OPTIONAL{?s lily:isBoosted ?isBoosted.}
OPTIONAL{?s lily:garden ?garden.}
OPTIONAL{?s lily:legion/schema:name ?legion.}
OPTIONAL{?s lily:schild/schema:name ?schild.}
OPTIONAL{?s lily:schutzengel/schema:name ?schutzengel.}
OPTIONAL{?s lily:pastSchild/schema:name ?pastSchild.}
OPTIONAL{?s lily:pastSchutzengel/schema:name ?pastSchutzengel.}
OPTIONAL{?s lily:youngerSchwester/schema:name ?youngerSchwester.}
OPTIONAL{?s lily:olderSchwester/schema:name ?olderSchwester.}
OPTIONAL{?s lily:pastYoungerSchwester/schema:name ?pastYoungerSchwester.}
OPTIONAL{?s lily:pastOlderSchwester/schema:name ?pastOlderSchwester.}
OPTIONAL{?s lily:roomMate/schema:name ?roomMate.}
FILTER(lang(?name)="ja")
FILTER(!bound(?legion) || lang(?legion)="ja")
FILTER(!bound(?schild) || lang(?schild)="ja")
FILTER(!bound(?schutzengel) || lang(?schutzengel)="ja")
FILTER(!bound(?pastSchild) || lang(?pastSchild)="ja")
FILTER(!bound(?pastSchutzengel) || lang(?pastSchutzengel)="ja")
FILTER(!bound(?youngerSchwester) || lang(?youngerSchwester)="ja")
FILTER(!bound(?olderSchwester) || lang(?olderSchwester)="ja")
FILTER(!bound(?pastYoungerSchwester) || lang(?pastYoungerSchwester)="ja")
FILTER(!bound(?pastOlderSchwester) || lang(?pastOlderSchwester)="ja")
FILTER(!bound(?roomMate) || lang(?roomMate)="ja")
}`;
xhr.send(request);
const responsedata = response.results.bindings;
xhr.abort();

const lilynodes = responsedata.map((v, i) => {
  return {
    id: i,
    slug: v.s.value.substring(v.s.value.lastIndexOf('/') + 1),
    label: v.name.value,
    shape: v.isBoosted === undefined ? 'dot' : v.isBoosted.value == 'true' ? 'star' : 'dot',
    borderWidth: 1.5,
    color: {
      border: lilyNodeBorderColor(v),
      background: lilyNodeBgColor(v),
      highlight: {
        border: lilyNodeBorderColor(v),
        background: lilyNodeBgColor(v),
      },
    },
    size: 10,
    mass: 1.5,
  };
});

const legions = uniq(responsedata.map((v, i) => {
  return v.hasOwnProperty('legion') ? v.legion.value : '';
}).filter((v) => v != ''));
const legionnodes = legions.map((v, i) => {
  return {
    id: i+10000,
    label: v,
    shape: 'square',
    borderWidth: 1.5,
    color: {
      border: 'green',
      background: 'lightgreen',
      highlight: {
        border: 'green',
        background: 'lightgreen',
      },
    },
    font: {
      size: 32,
      face: "Tahoma",
    },
    size: 20,
    mass: 4,
  };
});

const gardens = uniq(responsedata.filter(x => x.garden).map(x => x.garden.value))
const gardennodes = gardens.map((v, i) => {
  return {
    id: i+20000,
    label: v,
    shape: 'hexagon',
    borderWidth: 1.5,
    color: {
      border: 'green',
      background: 'lightgreen',
      highlight: {
        border: 'green',
        background: 'lightgreen',
      },
    },
    font: {
      size: 44,
      face: "Tahoma",
    },
    size: 50,
    mass: 5,
  }
});

const schild = responsedata.filter((v) => 'schild' in v);
const schildedges = schild.map((v) => {
  const fromlily = lilynodes.find((elem) => elem.label === v.name.value);
  const tolily = lilynodes.find((elem) => elem.label === v.schild.value);
  return {
    from: fromlily.id,
    to: tolily.id,
    arrows: {
      to: {
        enabled: true,
        scaleFactor: 0.5,
      }
    },
    title: ['シルト'],
    color: {
      color: 'hotpink',
      highlight: 'hotpink',
    },
    smooth: {
      enabled: true,
      type: 'continuous',
    },
  };
});

const schutzengel = responsedata.filter((v) => 'schutzengel' in v);
const schutzengeledges = schutzengel.map((v) => {
  const fromlily = lilynodes.find((elem) => elem.label === v.name.value);
  const tolily = lilynodes.find((elem) => elem.label === v.schutzengel.value);
  return {
    from: fromlily.id,
    to: tolily.id,
    arrows: {
      to: {
        enabled: true,
        scaleFactor: 0.5,
      }
    },
    title: ['シュッツエンゲル'],
    color: {
      color: 'darkorange',
      highlight: 'darkorange',
    },
    smooth: {
      enabled: true,
      type: 'continuous',
    },
  };
});

const pastSchild = responsedata.filter((v) => 'pastSchild' in v);
const pastSchildedges = pastSchild.map((v) => {
  const fromlily = lilynodes.find((elem) => elem.label === v.name.value);
  const tolily = lilynodes.find((elem) => elem.label === v.pastSchild.value);
  return {
    from: fromlily.id,
    to: tolily.id,
    arrows: {
      to: {
        enabled: true,
        scaleFactor: 0.5,
      }
    },
    title: ['過去のシルト'],
    color: {
      color: 'hotpink',
      highlight: 'hotpink',
    },
    dashes: [5,10],
    smooth: {
      enabled: true,
      type: 'continuous',
    },
  };
});

const pastSchutzengel = responsedata.filter((v) => 'pastSchutzengel' in v);
const pastSchutzengeledges = pastSchutzengel.map((v) => {
  const fromlily = lilynodes.find((elem) => elem.label === v.name.value);
  const tolily = lilynodes.find((elem) => elem.label === v.pastSchutzengel.value);
  return {
    from: fromlily.id,
    to: tolily.id,
    arrows: {
      to: {
        enabled: true,
        scaleFactor: 0.5,
      }
    },
    title: ['過去のシュッツエンゲル'],
    color: {
      color: 'darkorange',
      highlight: 'darkorange',
    },
    dashes: [5,10],
    smooth: {
      enabled: true,
      type: 'continuous',
    },
  };
});

const youngerSchwester = responsedata.filter((v) => 'youngerSchwester' in v);
const youngerSchwesteredges = youngerSchwester.map((v) => {
  const fromlily = lilynodes.find((elem) => elem.label === v.name.value);
  const tolily = lilynodes.find((elem) => elem.label === v.youngerSchwester.value);
  return {
    from: fromlily.id,
    to: tolily.id,
    arrows: {
      to: {
        enabled: true,
        scaleFactor: 0.5,
      }
    },
    title: ['シュベスター（妹）'],
    color: {
      color: 'hotpink',
      highlight: 'hotpink',
    },
    smooth: {
      enabled: true,
      type: 'continuous',
    },
  };
});

const olderSchwester = responsedata.filter((v) => 'olderSchwester' in v);
const olderSchwesteredges = olderSchwester.map((v) => {
  const fromlily = lilynodes.find((elem) => elem.label === v.name.value);
  const tolily = lilynodes.find((elem) => elem.label === v.olderSchwester.value);
  return {
    from: fromlily.id,
    to: tolily.id,
    arrows: {
      to: {
        enabled: true,
        scaleFactor: 0.5,
      }
    },
    title: ['シュベスター（姉）'],
    color: {
      color: 'darkorange',
      highlight: 'darkorange',
    },
    smooth: {
      enabled: true,
      type: 'continuous',
    },
  };
});

const pastYoungerSchwester = responsedata.filter((v) => 'pastYoungerSchwester' in v);
const pastYoungerSchwesteredges = pastYoungerSchwester.map((v) => {
  const fromlily = lilynodes.find((elem) => elem.label === v.name.value);
  const tolily = lilynodes.find((elem) => elem.label === v.pastYoungerSchwester.value);
  return {
    from: fromlily.id,
    to: tolily.id,
    arrows: {
      to: {
        enabled: true,
        scaleFactor: 0.5,
      }
    },
    title: ['過去のシュベスター（妹）'],
    color: {
      color: 'hotpink',
      highlight: 'hotpink',
    },
    dashes: [5,10],
    smooth: {
      enabled: true,
      type: 'continuous',
    },
  };
});

const pastOlderSchwester = responsedata.filter((v) => 'pastOlderSchwester' in v);
const pastOlderSchwesteredges = pastOlderSchwester.map((v) => {
  const fromlily = lilynodes.find((elem) => elem.label === v.name.value);
  const tolily = lilynodes.find((elem) => elem.label === v.pastOlderSchwester.value);
  return {
    from: fromlily.id,
    to: tolily.id,
    arrows: {
      to: {
        enabled: true,
        scaleFactor: 0.5,
      }
    },
    title: ['過去のシュベスター（姉）'],
    color: {
      color: 'darkorange',
      highlight: 'darkorange',
    },
    dashes: [5,10],
    smooth: {
      enabled: true,
      type: 'continuous',
    },
  };
});

const roomMate = responsedata.filter((v) => 'roomMate' in v);
var roomMateedges = [];
roomMate.forEach(r => {
  const fromlily = lilynodes.find((elem) => elem.label === r.name.value);
  const tolily = lilynodes.find((elem) => elem.label === r.roomMate.value);
  if (roomMateedges.some(elem => (elem.from === tolily.id) || (elem.to === fromlily.id))){
    return true;
  }
  roomMateedges.push({
    from: fromlily.id,
    to: tolily.id,
    arrows: '',
    title: ['ルームメイト'],
    color: {
      color: 'blueviolet',
      highlight: 'blueviolet',
    },
  });
});

const legionlily = responsedata.filter((v) => 'legion' in v);
const legionedges = legionlily.map((v) => {
  const fromlily = lilynodes.find((elem) => elem.label === v.name.value);
  const tolegion = legionnodes.find((elem) => elem.label === v.legion.value);
  return {
    from: fromlily.id,
    to: tolegion.id,
    color: {
      color: 'green',
      highlight: 'green',
    },
    arrows: {
      to: {
        enabled: true,
        scaleFactor: 0.5,
      }
    },
    title: '所属レギオン',
  };
});

const gargenlegions = legionnodes.map(n => {
  const garden = responsedata.find(x => x.garden && x.legion && x.legion.value === n.label).garden.value
  return {
    from: n.id,
    to: gardennodes.find(x => x.label === garden).id,
    color: {
      color: 'green',
      highlight: 'green',
    },
    width: 3,
    arrows: '',
    title: '所属ガーデン',
    length: 600,
  };
});

const gardenlily = responsedata.filter(v => v.garden && v.legion === undefined);
const gardensingles = gardenlily.map((v) => {
  const fromlily = lilynodes.find((elem) => elem.label === v.name.value);
  const togarden = gardennodes.find((elem) => elem.label === v.garden.value);
  return {
    from: fromlily.id,
    to: togarden.id,
    color: {
      color: 'green',
      highlight: 'green',
    },
    width: 1,
    arrows: '',
    title: '所属ガーデン',
    length: 300,
  };
});

const gardenedges = gargenlegions.concat(gardensingles)

xhr.open('POST', 'https://lily.fvhp.net/sparql/query?format=json', false);
xhr.setRequestHeader('content-type', 'application/sparql-query;charset=UTF-8');
request = `
PREFIX schema: <http://schema.org/>
PREFIX lily: <https://lily.fvhp.net/rdf/IRIs/lily_schema.ttl#>
SELECT ?from ?to ?relation
WHERE{
VALUES ?class {lily:Lily lily:Character lily:Teacher}
?s a ?class;
schema:name ?from;
schema:sibling ?rel.
?rel lily:additionalInformation ?relation;
 lily:resource/schema:name ?to.
FILTER(!bound(?from) || lang(?from)="ja")
FILTER(!bound(?to) || lang(?to)="ja")
}`;
xhr.send(request);

const sibling = response.results.bindings;
var siblingedges = [];
sibling.forEach(r => {
  const fromlily = lilynodes.find((elem) => elem.label === r.from.value);
  const tolily = lilynodes.find((elem) => elem.label === r.to.value);
  siblingedges.push({
    from: fromlily.id,
    to: tolily.id,
    arrows: {
      to: {
        enabled: true,
        scaleFactor: 0.5,
      }
    },
    title: [r.relation.value],
    color: {
      color: 'dodgerblue',
      highlight: 'dodgerblue',
    },
    smooth: {
      enabled: true,
      type: 'continuous',
    },
  });
});

var __edges = schildedges.concat(schutzengeledges, pastSchildedges, pastSchutzengeledges, youngerSchwesteredges, olderSchwesteredges, pastYoungerSchwesteredges, pastOlderSchwesteredges, roomMateedges, siblingedges);

xhr.open('POST', 'https://lily.fvhp.net/sparql/query?format=json', false);
xhr.setRequestHeader('content-type', 'application/sparql-query;charset=UTF-8');
request = `
PREFIX schema: <http://schema.org/>
PREFIX lily: <https://lily.fvhp.net/rdf/IRIs/lily_schema.ttl#>
SELECT ?from ?to ?relation
WHERE{
VALUES ?class {lily:Lily lily:Character lily:Teacher}
?s a ?class;
schema:name ?from;
lily:relationship ?rel.
?rel lily:additionalInformation ?relation;
 lily:resource/schema:name ?to.
FILTER(!bound(?from) || lang(?from)="ja")
FILTER(!bound(?to) || lang(?to)="ja")
}`;
xhr.send(request);

const relationdata = response.results.bindings;
var relationedges = [];
relationdata.forEach(r => {
  const fromlily = lilynodes.find(elem => elem.label === r.from.value);
  const tolily = lilynodes.find(elem => elem.label === r.to.value);
  if (__edges.some(elem => (elem.from === fromlily.id) && (elem.to === tolily.id))){
    var e = __edges.find(elem => (elem.from === fromlily.id) && (elem.to === tolily.id));
    if (!e.title.includes(r.relation.value) && r.relation.value !== '') {
      e.title.push(r.relation.value);
    }
    return true;
  }
  else if (__edges.some(elem => (elem.from === tolily.id) && (elem.to === fromlily.id))){
    var e = __edges.find(elem => (elem.from === tolily.id) && (elem.to === fromlily.id));
    e.arrows.to = {
      enabled: false,
      scaleFactor: 0.5,
    };
    if (!e.title.includes(r.relation.value) && r.relation.value !== '') {
      e.title.push(r.relation.value);
    }
    return true;
  }
  else {
    __edges.push({
      from: fromlily.id,
      to: tolily.id,
      arrows: {
        to: {
          enabled: true,
          scaleFactor: 0.5,
        }
      },
      title: r.relation.value !== '' ? [r.relation.value]: [],
      color: {
        color: 'darkgray',
        highlight: 'crimson',
      },
      length: 150,
      physics: false,
    });
    return true;
  }
});

const fullnodes = lilynodes.concat(legionnodes).concat(gardennodes);
__edges.forEach(e => {
  e.title = e.title.join('\n');
});
const fulledges = __edges.concat(legionedges).concat(gardenedges);
const nodes = new vis.DataSet(fullnodes);
const edges = new vis.DataSet(fulledges);
const container = document.getElementById('network');
const data = {
  nodes: nodes,
  edges: edges
};

let options = {
  nodes: {
    shape: "dot",
    scaling: {
      min: 6,
      max: 48,
      label: {
        min: 4,
        maxVisible: 48,
        drawThreshold: 6,
      },
    },
    font: {
      size: 40,
      face: "Tahoma",
    },
  },
  edges: {
    color: { inherit: "from" },
    smooth: {
      type: "continuous",
    },
    width: 2,
    scaling: {
      min: 4,
      label: {
        min: 4,
        drawThreshold: 6,
      },
    },
    smooth: {
      enabled: false,
      type: 'continuous',
    },
  },
  physics: {
    enabled: true,
    minVelocity: 0.5,
    barnesHut: {
      theta: 0.75,
      centralGravity: 0.25,
      gravitationalConstant: -1000,
      springLength: 150,
      springConstant: 0.01,
    },
    forceAtlas2Based: {
      centralGravity: 0.02,
      gravitationalConstant: -1000,
      springLength: 150,
      springConstant: 0.1,
    },
    repulsion: {
      nodeDistance: 200,
      centralGravity: 0.015,
      springLength: 150,
      springConstant: 0.01,
    },
    solver: 'barnesHut',
    timestep: 0.5,
  },
  layout: {
    improvedLayout: false,
  },
  interaction: {
    navigationButtons: true,
    tooltipDelay: 200,
  },
  autoResize: true,
  height: window.innerHeight - 16 + 'px',
};
const network = new vis.Network(container, data, options);
network.on('doubleClick', (e) => {
  if (e.nodes.length) {
    if (e.nodes[0] < 10000) {
      // lily node
      const slug = lilynodes.find(x => x.id === e.nodes[0]).slug;
      const lemonadeUrl = `https://lemonade.lily.garden/lily/${slug}`;
      window.open(lemonadeUrl);
    }
  }
});
network.on('zoom', (e) => {
  if (e.scale <= 0.25 && options.nodes.font.size !== 40) {
    options.nodes.font.size = 40;
    network.setOptions(options);
  } else if (0.25 < e.scale && e.scale <= 0.45 && options.nodes.font.size !== 30) {
    options.nodes.font.size = 30;
    network.setOptions(options);
  } else if (0.45 < e.scale && options.nodes.font.size !== 20) {
    options.nodes.font.size = 20;
    network.setOptions(options);
  }
});
