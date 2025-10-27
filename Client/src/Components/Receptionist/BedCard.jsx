import React from "react";
import { motion } from "framer-motion";
import {
  FiUser,
  FiPhone,
  FiCalendar,
  FiDollarSign,
  FiInfo,
  FiStar,
} from "react-icons/fi";
import {
  FaBed,
  FaProcedures,
  FaRegHospital,
  FaTemperatureHigh,
  FaWind,
} from "react-icons/fa";
import { GiHospitalCross } from "react-icons/gi";

const BedCard = ({ bed, onAssign, onDischarge }) => {
  
  const statusColors = {
    available: {
      bg: "bg-green-50",
      text: "text-green-800",
      border: "border-green-200",
    },
    occupied: {
      bg: "bg-blue-50",
      text: "text-blue-800",
      border: "border-blue-200",
    },
    maintenance: {
      bg: "bg-yellow-50",
      text: "text-yellow-800",
      border: "border-yellow-200",
    },
  };

  const statusIcons = {
    available: <FaBed className="text-green-600" size={18} />,
    occupied: <FiUser className="text-blue-600" size={18} />,
    maintenance: <FaProcedures className="text-yellow-600" size={18} />,
  };

  const wardIcons = {
    general: <FaRegHospital className="text-gray-600" size={16} />,
    icu: <GiHospitalCross className="text-red-600" size={16} />,
    private: <FiStar className="text-purple-600" size={16} />,
  };

  const featureIcons = {
    Oxygen: <FaWind className="text-blue-500" size={14} />,
    AC: <FaTemperatureHigh className="text-green-500" size={14} />,
    Ventilator: <GiHospitalCross className="text-red-500" size={14} />,
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-xl shadow-md overflow-hidden border ${
        statusColors[bed.status]?.border
      } transition-all duration-200`}
    >
      {}
      <div
        className={`p-4 ${
          statusColors[bed.status]?.bg
        } flex justify-between items-center border-b ${
          statusColors[bed.status]?.border
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            {statusIcons[bed.status]}
          </div>
          <div>
            <h3 className="font-bold text-lg">{bed.bedNumber}</h3>
            <p
              className={`text-sm font-medium capitalize ${
                statusColors[bed.status]?.text
              }`}
            >
              {bed.status}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end space-x-1">
            {wardIcons[bed.ward?.type] || <FaRegHospital size={16} />}
            <span className="font-semibold text-gray-700">
              {bed.ward?.name}
            </span>
          </div>
          <div className="flex items-center justify-end mt-1">
            <FiDollarSign size={12} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-600 ml-1">
              {bed.ratePerDay}/day
            </span>
          </div>
        </div>
      </div>

      {}
      <div className="p-4">
        {}
        {bed.status === "occupied" && bed.patient && (
          <>
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                <FiUser className="mr-2" />
                Patient Details
              </h4>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Name</p>
                    <p className="font-medium">{bed.patient.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Age/Gender</p>
                    <p className="font-medium">
                      {bed.patient.age} / {bed.patient.gender}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Contact</p>
                    <p className="font-medium">{bed.patient.contact}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Condition</p>
                    <p className="font-medium">{bed.patient.condition}</p>
                  </div>
                </div>
              </div>
            </div>

            {}
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                <FiCalendar className="mr-2" />
                Admission Period
              </h4>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Admitted</p>
                    <p className="font-medium">
                      {new Date(bed.admissionDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Discharge</p>
                    <div className="flex items-center">
                      <p
                        className={`font-medium ${
                          new Date(bed.dischargeDate) < new Date()
                            ? "text-red-600"
                            : "text-gray-700"
                        }`}
                      >
                        {new Date(bed.dischargeDate).toLocaleDateString()}
                      </p>
                      {new Date(bed.dischargeDate) < new Date() && (
                        <span
                          className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full"
                          title={`${Math.floor(
                            (new Date() - new Date(bed.dischargeDate)) /
                              (1000 * 60 * 60 * 24)
                          )} days overdue`}
                        >
                          Overdue
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {}
        {bed.features?.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2 flex items-center">
              <FiInfo className="mr-2" />
              Bed Features
            </h4>
            <div className="flex flex-wrap gap-2">
              {bed.features.map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-800"
                >
                  {featureIcons[feature] || (
                    <FiInfo size={12} className="mr-1" />
                  )}
                  <span className="ml-1">{feature}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {}
        <div className="text-xs text-gray-500 mt-4 flex justify-between items-center">
          <div>Created: {new Date(bed.createdAt).toLocaleDateString()}</div>
          <div>Updated: {new Date(bed.updatedAt).toLocaleDateString()}</div>
        </div>

        {}
        <div className="mt-4">
          {bed.status === "occupied" ? (
            <button
              onClick={onDischarge}
              className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors flex items-center justify-center"
            >
              Discharge Patient
            </button>
          ) : bed.status === "available" ? (
            <button
              onClick={onAssign}
              className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors flex items-center justify-center"
            >
              Assign Patient
            </button>
          ) : (
            <div className="text-center py-2 text-gray-500 text-sm">
              Bed under maintenance - not available
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BedCard;
