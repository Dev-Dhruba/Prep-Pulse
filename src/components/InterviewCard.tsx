type Props = {
    coverImage: string;
    role: string;
    level: string;
    totalQuestions: number;
    type: 'recent' | 'history';
  };
  
  export default function InterviewCard({ coverImage, role, level, totalQuestions, type }: Props) {
    return (
      <div className="border rounded-xl shadow-md p-4 w-full max-w-sm bg-white">
        <img src={coverImage} alt="cover" className="w-full h-32 object-cover rounded-md mb-2" />
        <div className="text-sm mb-1">Role: {role}</div>
        <div className="text-sm mb-1">Level: {level}</div>
        <div className="text-sm mb-4">Total Questions: {totalQuestions}</div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          {type === 'recent' ? 'Attempt Now' : 'Analytics'}
        </button>
      </div>
    );
  }