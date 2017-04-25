const propExtractor = (propContainer) => {
  let props = document.getElementById(propContainer).textContent;
  props = props.replace("<![CDATA[", "").replace("]]>", "");

  return JSON.parse(props);
};

export default propExtractor;
