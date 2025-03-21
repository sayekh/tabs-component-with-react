import React, { useState, useEffect } from "react";
import styles from "./style.module.css";

function DraggableTabs() {
  const [tabs, setTabs] = useState([
    {
      id: 1,
      title: "TAB 1",
      content:
        "Lorem TAB 1 architecto aspernatur est porro odit ratione! Neque magni magnam aliquid sit quo!",
    },
    {
      id: 2,
      title: "TAB 2",
      content:
        "Lorem TAB 2 architecto aspernatur est porro odit ratione! Neque magni magnam aliquid sit quo!",
    },
    {
      id: 3,
      title: "TAB 3",
      content:
        "Lorem TAB 3 architecto aspernatur est porro odit ratione! Neque magni magnam aliquid sit quo!",
    },
    {
      id: 4,
      title: "TAB 4",
      content:
        "Lorem TAB 4 architecto aspernatur est porro odit ratione! Neque magni magnam aliquid sit quo!",
    },
  ]);
  const [selectedTab, setSelectedTab] = useState(null);
  const [helper, setHelper] = useState(null);
  const [tabTransitioning, setTabTransitioning] = useState(false);
  useEffect(() => {
    let tabsFromLocal = JSON.parse(localStorage.getItem("tabs"));
    let selectedTabFromLocal = localStorage.getItem("selectedTab");
    if (tabsFromLocal) {
      setTabs(tabsFromLocal);
    }
    if (selectedTabFromLocal) {
      setSelectedTab(+selectedTabFromLocal);
    }
  }, []);

  useEffect(() => {
    let timer;
    if (helper !== null) {
      setTabTransitioning(true);
      timer = setTimeout(() => {
        setTabTransitioning(false);
        setSelectedTab(helper);
        localStorage.setItem("selectedTab", helper);
      }, 1000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [helper]);

  const dragStartHandler = (e, index) => {
    e.dataTransfer.setData("tabIndex", index);
  };
  const dropHandler = (e, index) => {
    const draggedIndex = e.dataTransfer.getData("tabIndex");
    const newTabs = [...tabs];
    const [draggedTab] = newTabs.splice(draggedIndex, 1);
    newTabs.splice(index, 0, draggedTab);
    setTabs(newTabs);
    setHelper(index);
    localStorage.setItem("tabs", JSON.stringify(newTabs));
  };
  const dargOverHandler = (e) => {
    e.preventDefault();
  };
  return (
    <div className={styles.Container}>
      <div className={styles.tabs}>
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            className={`${styles.tabTitle} ${
              selectedTab !== index ? styles.selectedTab : null
            }`}
            draggable
            onDragStart={(e) => dragStartHandler(e, index)}
            onDrop={(e) => dropHandler(e, index)}
            onDragOver={dargOverHandler}
            onClick={() => setHelper(index)}
          >
            {tab.title}
          </button>
        ))}
      </div>
      {selectedTab !== null ? (
        <div
          className={`${styles.tabContent} ${
            tabTransitioning ? styles.unMount : ""
          }`}
        >
          <h2>Content {tabs[selectedTab].title.replace("TAB", "")}</h2>
          {tabs[selectedTab].content}
        </div>
      ) : (
        <div
          className={`${styles.tabContent} ${styles.empty} ${
            tabTransitioning ? styles.unMount : ""
          }`}
        >
          Select a tab
        </div>
      )}
    </div>
  );
}

export default DraggableTabs;
