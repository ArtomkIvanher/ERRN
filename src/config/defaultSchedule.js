const defaultSchedule = {
	duration: 80,
	breaks: [10, 20, 10, 10],
	start_time: '08:30',
	auto_save: 60,
	repeat: 1,
	theme: ['dark', 'red'],
	subjects: [
		{
			id: 1,
			name: 'Mathematics',
			teacher: 2,
			zoom_link: 'https://zoom.com/lesson1',
			color: 'red',
		},
		{
			id: 2,
			name: 'Ukrainian Language',
			teacher: 1,
			zoom_link: 'https://zoom.com/lesson2',
			color: 'red',
		},
		{
			id: 3,
			name: 'Biology',
			teacher: 4,
			zoom_link: 'https://zoom.com/lesson3',
			color: 'red',
		},
		{
			id: 4,
			name: 'Physics',
			teacher: 5,
			zoom_link: 'https://zoom.com/lesson4',
			color: 'red',
		},
		{
			id: 5,
			name: 'Informatics',
			teacher: 3,
			zoom_link: 'https://zoom.com/lesson5',
			color: 'red',
		},
	],
	teachers: [
		{
			id: 1,
			name: 'John Doe',
			phone: '09340001',
		},
		{
			id: 2,
			name: 'Jane Smith',
			phone: '09340002',
		},
		{
			id: 3,
			name: 'Mark Brown',
			phone: '09340003',
		},
		{
			id: 4,
			name: 'Emily White',
			phone: '09340004',
		},
		{
			id: 5,
			name: 'Alice Green',
			phone: '09340005',
		},
	],
	schedule: Array(7).fill({ week1: [], week2: [], week3: [], week4: [] }),
}

export default defaultSchedule
