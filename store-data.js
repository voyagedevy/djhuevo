window.DJHUEVO_STORE = {
  products: [
    {
      id: 'hoodie-white',
      name: '6009 Flame Hoodie',
      variant: 'White',
      price: '$60',
      image: 'images/merch-hoodie-white.jpg',
      alt: '6009 white flame hoodie',
      category: 'Hoodie'
    },
    {
      id: 'hoodie-black',
      name: '6009 Flame Hoodie',
      variant: 'Black',
      price: '$60',
      image: 'images/merch-hoodie-black.jpg',
      alt: '6009 black flame hoodie',
      category: 'Hoodie'
    },
    {
      id: 'hoodie-pink',
      name: '6009 Flame Hoodie',
      variant: 'Pink',
      price: '$60',
      image: 'images/merch-hoodie-pink.jpg',
      alt: '6009 pink flame hoodie',
      category: 'Hoodie'
    },
    {
      id: 'pants-black',
      name: '6009 Stacked Pants',
      variant: 'Black',
      price: '$60',
      image: 'images/merch-pants-black.jpg',
      alt: '6009 black stacked pants',
      category: 'Pants'
    },
    {
      id: 'pants-white',
      name: '6009 Stacked Pants',
      variant: 'White',
      price: '$60',
      image: 'images/merch-pants-white.jpg',
      alt: '6009 white stacked pants',
      category: 'Pants'
    },
    {
      id: 'pants-pink',
      name: '6009 Stacked Pants',
      variant: 'Pink',
      price: '$60',
      image: 'images/merch-pants-pink.jpg',
      alt: '6009 pink stacked pants',
      category: 'Pants'
    }
  ],
  rooms: [
    {
      id: 'closet',
      number: 'Room 01',
      title: 'Fit Room',
      subtitle: '6009 Hoodies',
      pulse: 'Fit check before the function',
      mapClass: 'map-room-closet',
      viewClass: 'closet-room',
      bgClass: 'room-bg-closet',
      prev: 'bedroom',
      next: 'studio',
      hotspots: [
        { className: 'hotspot-rack', productId: 'hoodie-white', featured: true },
        { className: 'hotspot-table', productId: 'hoodie-black' },
        { className: 'hotspot-shoes', productId: 'pants-pink' }
      ]
    },
    {
      id: 'bedroom',
      number: 'Room 02',
      title: 'Afterhours',
      subtitle: 'Stacked Pants',
      pulse: 'Low light, pressed fits, late arrival energy',
      mapClass: 'map-room-bedroom',
      viewClass: 'bedroom-room',
      bgClass: 'room-bg-bedroom',
      prev: 'lounge',
      next: 'closet',
      hotspots: [
        { className: 'hotspot-bed', productId: 'hoodie-pink' },
        { className: 'hotspot-chair', productId: 'pants-black' }
      ]
    },
    {
      id: 'studio',
      number: 'Room 03',
      title: 'Booth',
      subtitle: 'Tu Padre Signal',
      pulse: 'Music room live from San Antonio',
      mapClass: 'map-room-studio',
      viewClass: 'studio-room',
      bgClass: 'room-bg-studio',
      prev: 'closet',
      next: 'kitchen',
      album: true,
      listen: true,
      services: true,
      hotspots: [
        { className: 'hotspot-console', productId: 'hoodie-black' }
      ]
    },
    {
      id: 'lounge',
      number: 'Room 04',
      title: 'La Sala',
      subtitle: 'Full 6009 Sets',
      pulse: 'Meet-up room for sets, merch, and booking inquiries',
      mapClass: 'map-room-lounge',
      viewClass: 'lounge-room',
      bgClass: 'room-bg-lounge',
      prev: 'kitchen',
      next: 'bedroom',
      booking: true,
      hotspots: [
        { className: 'hotspot-sofa', productId: 'pants-white' },
        { className: 'hotspot-wall', productId: 'hoodie-white', label: 'Full 6009 Set', meta: 'Collection' }
      ]
    },
    {
      id: 'kitchen',
      number: 'Room 05',
      title: 'Late Plate',
      subtitle: 'Night Essentials',
      pulse: 'Last stop before the afters',
      mapClass: 'map-room-kitchen',
      viewClass: 'kitchen-room',
      bgClass: 'room-bg-kitchen',
      prev: 'studio',
      next: 'lounge',
      hotspots: [
        { className: 'hotspot-counter', productId: 'pants-black', label: 'Late Night Pants' },
        { className: 'hotspot-fridge', productId: 'hoodie-pink' }
      ]
    }
  ],
  streamingLinks: [
    {
      name: 'Spotify',
      href: 'https://open.spotify.com/artist/1nTWI80tkOcM5kQyXSzasu',
      tone: 'green'
    },
    {
      name: 'Apple Music',
      href: 'https://music.apple.com/us/artist/dj-huevo/1229824021',
      tone: 'ink'
    },
    {
      name: 'YouTube Music',
      href: 'https://music.youtube.com/channel/UCJrV6je1dMRMkDFnUoS1AIw',
      tone: 'yellow'
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/djhuevot/',
      tone: 'purple'
    }
  ],
  booking: {
    email: 'booking@djhuevo.com',
    rate: '$100/hr minimum',
    href: 'booking.html',
    title: 'Book DJ Huevo',
    note: 'Private events, clubs, parties, and San Antonio late-night rooms.'
  },
  shopify: {
    componentId: 'collection-component-1778036588622',
    domain: '0rdbbc-mm.myshopify.com',
    token: 'b0f8c60c5ada07279964f2404b433521',
    collectionId: '530465980635'
  }
};
