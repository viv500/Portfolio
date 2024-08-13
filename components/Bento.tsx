import React from 'react';
import { BentoGridItem, BentoGrid } from './ui/bento-grid';
import { BentoItemsSmall, BentoItemsMedium, BentoItemsLarge } from './data/index';

const Bento = () => {
  return (
    <section id="about">
      <BentoGrid>
        {BentoItemsSmall.map((item, index) => (
          <BentoGridItem
            id={item.id}
            key={index}
            title={item.title}
            description={item.description}
            img={item.img}
            imgClass={item.imgClass}
            // conditional rendering based on screen size
            className={`sm:block md:hidden lg:hidden block ${item.className}`}
          />
        ))}
        {BentoItemsMedium.map((item, index) => (
          <BentoGridItem
            id={item.id}
            key={index}
            title={item.title}
            description={item.description}
            img={item.img}
            // conditional rendering based on screen size
            className={`sm:hidden md:block lg:hidden hidden ${item.className}`}
          />
        ))}
        {BentoItemsLarge.map((item, index) => (
          <BentoGridItem
            id={item.id}
            key={index}
            title={item.title}
            description={item.description}
            img={item.img}
            // conditional rendering based on screen size
            className={`sm:hidden md:hidden lg:block hidden ${item.className}`}
          />
        ))}
      </BentoGrid>
    </section>
  );
};

export default Bento;
